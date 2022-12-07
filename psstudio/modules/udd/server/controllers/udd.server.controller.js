/**
 * Created by vishnu on 22/11/18.
 */

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    fs = require('fs'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    // ownerShip = require("../../../../utils/ownership/ownership-admin.utils"),
    UddFlow = mongoose.model('UddFlow'),
    Scheduler = mongoose.model('Scheduler'),
    Dataconnection = mongoose.model('Dataconnection'),
    ProjectController = require("../../../projects/server/controllers/projects.server.controller");
var socket = require("../../../../utils/socket/core.socket.utils");
var uploadUtil = require("../../../../utils/general/uploader.utils.server");
var date = Date(Date.now());
date = date.toString();
var curFlowId;
var destination = './projects/';
exports.getFlowId = function (res) {
    curFlowId = res;
};

//function create udd flow
function createUddFlow(req, config, res, callback) {
    var date = new Date();
    var timestamp = date.getTime();
    if (config.connectionID) {
        Dataconnection.findById(config.connectionID).exec(function (err, dataConns) {
            if (err) {
                logger.error("Error while finding data connections", { error: err, Date: date });
            }
            config.flowName = dataConns.connectionName + '_' + timestamp;
            var uddFlow = new UddFlow(config);
            uddFlow.save(function (err) {
                if (err) {
                    logger.error('Error while creating Udd Flow', {
                        error: err, Date: date
                    });

                    if (res)
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    else
                        callback(null);
                } else {
                    Dataconnection.findOneAndUpdate({ _id: config.connectionID }, { dataflowId: uddFlow._id }, function (err) {
                        if (err) {
                            logger.error("Could not update data connection", { error: err, Date: date });
                        } else {

                        }
                    });
                    if (res)
                        res.json(uddFlow);
                    else
                        callback(uddFlow);
                }
            });
        })
    } else {
        config.flowName = config.flowName + '_' + timestamp;
        // checking if scheduler is none.
        (config.scheduleId === 'None') && delete config.scheduleId;
        var uddFlow = new UddFlow(config);
        uddFlow.save(function (err, data) {
            if (err) {
                logger.error('Error while creating Udd Flow', {
                    error: err, Date: date
                });

                if (res)
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                else
                    callback(null);
            } else {
                if (res) {
                    if (config.hasOwnProperty('scheduleId')) {
                        var scheduler = req.scheduler;
                        scheduler.tasks = scheduler.tasks.concat([{ taskType: 'dataFlow', taskId: data._id }]);
                        scheduler.save();
                    }
                    res.json(uddFlow);
                } else {
                    callback(uddFlow);
                }
            }
        });
    }


}

/**
 * Create a Sync Option
 */
exports.create = function (req, res) {
    req.body.createdBy = req.user._id;
    createUddFlow(req, req.body, res);
};

/**
 * Show the current Sync Option
 */
exports.read = function (req, res) {
    res.json(req.uddFlow);
};
//Function find a particular scheduler
function getScheduler(schedulerId) {
    return new Promise((resolve, reject) => {
        Scheduler.findById(schedulerId, function (err, doc) {
            if (err) {
                logger.error('Could not find task', { error: err, Date: date });
                reject('error while finding tasks in scheduler');
                // return res.status(400).send({ message: 'Could not find task' });
            }
            resolve(doc);
        })
    });
}
/**
 * Update a Sync Option
 */
exports.update = function (req, res) {
    var oldSchedulerId = req.uddFlow.scheduleId;
    var uddFlow = req.uddFlow;
    uddFlow.flowName = req.body.flowName;
    uddFlow.flowId = req.body.flowId;
    uddFlow.flowType = req.body.flowType;
    uddFlow.projectId = req.body.projectId;
    uddFlow.scheduleId = req.body.scheduleId;
    uddFlow.dataGroupId = req.body.dataGroupId;
    //uddFlow.createdBy = req.user_id;
    //if both scheduler ids are not matching
    if ((req.body.scheduleId != 'None') && oldSchedulerId && !(oldSchedulerId.equals(req.body.scheduleId))) {
        //Get existing scheduler associated with the flow
        getScheduler(oldSchedulerId).then((oldScheduler) => {
            try {
                var task = oldScheduler.tasks.filter(function (item) {
                    return item.taskId.equals(req.uddFlow._id);
                });
                //checking if the task array is empty.
                task.length && oldScheduler.tasks.id(task[0]._id).remove();
                oldScheduler.save();
            } catch (error) {
                console.log(error);
            }
            //FInd the new scheduler and return
            return getScheduler(req.body.scheduleId);

        }).then((newScheduler) => {
            newScheduler.tasks = newScheduler.tasks.concat([{ taskType: 'dataFlow', taskId: req.uddFlow._id }]);
            return newScheduler.save();
        }).then((data) => {
            saveUddData(uddFlow).then((doc) => {
                return res.json(doc);
            }, (err) => {
                logger.error('Error while updating Udd Flow ' + req.uddFlow._id, {
                    error: err, Date: date
                });
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err),
                    code: err.code
                });
            })
        }).catch((rejection) => {
            logger.error('Error while updating Udd Flow ' + req.uddFlow._id, {
                error: rejection, Date: date
            });
        });
    } else if (req.body.scheduleId == 'None') {
        getScheduler(oldSchedulerId).then((oldScheduler) => {
            try {
                var task = oldScheduler.tasks.filter(function (item) {
                    return item.taskId.equals(req.uddFlow._id);
                });
                //checking if the task array is empty.
                task.length && oldScheduler.tasks.id(task[0]._id).remove();
                oldScheduler.save();
            } catch (error) {
                console.log(error);
            }
            //FInd the new scheduler and return
            return uddFlow.scheduleId = undefined;
        }).then((data) => {
            saveUddData(uddFlow).then((doc) => {
                return res.json(doc);
            }, (err) => {
                logger.error('Error while updating Udd Flow ' + req.uddFlow._id, {
                    error: err, Date: date
                });
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err),
                    code: err.code
                });
            })
        }).catch((rejection) => {
            logger.error('Error while updating Udd Flow ' + req.uddFlow._id, {
                error: rejection, Date: date
            });
        });
    } else {
        if ((!oldSchedulerId) && req.body.scheduleId) {
            getScheduler(req.body.scheduleId).then((selectedScheduler) => {
                selectedScheduler.tasks = selectedScheduler.tasks.concat([{ taskType: 'dataFlow', taskId: req.uddFlow._id }]);
                selectedScheduler.save();
            });
        }
        saveUddData(uddFlow).then((doc) => {
            return res.json(doc);
        }, (err) => {
            logger.error('Error while updating Udd Flow ' + req.uddFlow._id, {
                error: err, Date: date
            });
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err),
                code: err.code
            });
        })
    }
};

function saveUddData(uddFlow) {
    return uddFlow.save();
}
/**
 * Delete a Sync Option
 */
exports.delete = function (req, res, next) {
    var uddFlow = req.uddFlow;
    uddFlow.deleteOne(function (err) {
        if (err) {
            logger.error('Error while deleting Udd Flow ' + uddFlow._id, {
                error: err, Date: date
            });
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            fs.readFile('./node-red/flows/psflow.json', 'utf8', function (err, data) {
                if (err) throw err;
                else {
                    var flows = JSON.parse(data);
                    var finalData = flows.filter(function (temp) {
                        if (temp.z != uddFlow.flowId && temp.id != uddFlow.flowId) { return temp }
                    });
                    var json = JSON.stringify(finalData);
                    fs.writeFile('./node-red/flows/psflow.json', json, function (err) {
                        if (err) throw err;
                    })
                }
            });
            if (uddFlow.flowType == 'interceptor') {
                Dataconnection.updateOne({ dataflowId: uddFlow._id }, { '$unset': { 'dataflowId': 1 } }, function (err, dataConn) {
                    if (err) {
                        logger.error('Error occured while deleting flow in data connection', { error: err, Date: date });
                        res.send('Error occured while deleting flow in data connection', { error: err });
                    }
                });
            }

            if (req.uddFlow.scheduleId) {
                req.taskId = req.uddFlow._id;
                req.scheduleId = req.uddFlow.scheduleId;
                next()
            } else {
                res.json(uddFlow);
            }
        }
    });
};

//function to start the flow
exports.startUddFlow = function (req, res) {
    var uddFlow = req.uddFlow;
    var name = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id });
    var basedir = name.replace('undefined', '');
    var uddParams = {
        projectId: req.project._id,
        createdBy: req.project.createdBy,
        basedir: basedir,
        destination: destination + req.project._id,
        dataGroupId: uddFlow.dataGroupId,
        uniqueFlowId: req.uddFlow._id,
        flowId: uddFlow.flowId
    }
    ProjectController.executeFlow(uddParams)
    res.json({ status: 'flow_start', projectDetails: req.project });
}

// function executeFlow(flowId) {

//     fs.readFile('./node-red/flows/psflow.json', 'utf8', function (err, data) {
//         if (err) throw err;
//         else {
//             var flows = JSON.parse(data);

//             flows.forEach(function (selectedFlowObject) {
//                 // if (selectedFlowObject.z === flowId && selectedFlowObject.type === 'input') {
//                 if (selectedFlowObject.z === flowId) {
//                     var id = selectedFlowObject.id;

//                     var msg = {};
//                     // msg.dataStream = _dataStream;
//                     // msg.res = res;
//                     // msg._id=_dataStream._id;
//                     // msg.deviceId=_dataStream.deviceId;
//                     // msg.timestamp = _dataStream.timestamp;
//                     // msg.payload = _dataStream.data;

//                     // var dataTagCount = Object.keys(msg.payload).length;

//                     var RED = require(path.resolve("./config/config")).RED;
//                     // var injector = require("../../../../node-red/nodes/core/storage/50-file")(RED);
//                     var node = RED.nodes.getNode(id);
//                     node.receive()

//                 }
//             });
//         }
//     });

// }

// exports.dumpData = function(msg){
//     if(msg.payload){
//         var x = JSON.stringify(msg.payload)
//         fs.appendFile("/home/vishnu/Documents/projects/Data/Regression/test.json",x,function(err){
//             if (err) throw err;
//             socket.emit("flowCompleted",{},{_id:msg.projectId,createdBy:msg.createdBy});
//         })
//     }
// }

/**
 * List of Udd Flow
 */
exports.list = function (req, res) {
    var projectId = req.query.projectId
    var queryobj = {}
    //to get udd flows owned by user
    queryobj = {
        projectId: projectId,
        createdBy: req.user._id
    }
    return listOwnedUddFlows(req, res, queryobj)
};

//function to list udd owned flows
function listOwnedUddFlows(req, res, queryobj) {
    UddFlow.find(queryobj).exec(function (err, uddFlow) {
        if (err) {
            logger.error('Error while listing Udd Flow ', {
                error: err, Date: date
            });
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(uddFlow);
        }
    });
}

/**
 * Udd Flow middleware
 */
exports.uddByID = function (req, res, next, id) {
    UddFlow.findById(id).exec(function (err, uddFlow) {
        if (err) {
            logger.error('Error while finding Udd Flow ' + uddFlow._id, {
                error: err, Date: date
            });
            return next(err);
        }
        if (!uddFlow) {

            return next(new Error('Failed to load Udd Flow ' + id));
        }
        req.uddFlow = uddFlow;
        next();
    });
};

exports.findById = findById;

function findById(id, callback) {
    UddFlow.findById(id).exec(function (err, uddFlow) {
        if (err) {
            logger.error('Error while finding Udd Flow ' + id, {
                error: err, Date: date
            });
            return callback(null);
        } else if (!uddFlow)
            return callback(null);
        callback(uddFlow);
    });
}

//function to log the node-red error to db
exports.nodeRedErrorLogger = function (msg) {
    return new Promise(function (resolve, reject) {
        if (msg.path) {
            UddFlow.find({ flowId: msg.path }).sort({ createdAt: -1 }).limit(1).then(function (data) {
                if (msg.level == 20) {
                    var log = {
                        metaData: {
                            nodeType: msg.type,
                            nodeId: msg.id || null,
                            nodeName: msg.name || null
                        },
                        projectId: data[0].projectId,
                        userId: data[0].createdBy,
                        level: 'error',
                        message: msg.msg,
                        loggerId: data[0]._id,
                        loggerType: 'Uddflow'
                    }
                    socket.emit("nodeRedFlowExecution", { status: "flow_execution_failed", projectId: data[0].projectId, nodeType: msg.type }, { _id: data[0].projectId, createdBy: data[0].createdBy });
                    auditLogger.logit(log);
                    resolve('error logged!');
                } else {
                    if (data.length > 0) {
                        socket.emit("nodeRedFlowExecution", { status: "flow_execution_success", projectId: data[0].projectId, nodeType: msg.type }, { _id: data[0].projectId, createdBy: data[0].createdBy });
                    }
                    resolve();
                }
            }, function (error) {
                reject(error);
            });
        } else {
            reject();
        }
    }).catch(function (error) {
        if (error) {
            console.log(error);
        }
    });
}