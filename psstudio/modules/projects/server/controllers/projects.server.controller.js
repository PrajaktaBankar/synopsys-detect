/**
 * Created by Saket on 17/10/17.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller')
mongoose = require('mongoose'),
    ProjectConfig = mongoose.model('projectConfig'),
    TrainedModel = mongoose.model('trainedModel'),
    Eda = mongoose.model('eda'),
    UddFlow = mongoose.model('UddFlow'),
    Notebook = mongoose.model('notebooks');
AuditLog = mongoose.model('auditLog'),
    EdaProgress = mongoose.model('edaProgress'),
    FeatureRepository = mongoose.model('FeatureRepository'),
    SharedFeature = mongoose.model('SharedFeature'),
    TrainedModelData = mongoose.model('trainedModelData'),
    Trainings = mongoose.model('trainings'),
    Models = mongoose.model('models'),
    DataDrift = mongoose.model('DataDrift'),
    DriftConfig = mongoose.model('DriftConfig'),
    Files = mongoose.model('Files'),
    Experiments = mongoose.model('taexperiments'),
    ShareOutput = mongoose.model('ShareOutput'),
    Output = mongoose.model('Output'),
    DataGroup = mongoose.model('Datagroup'),
    Rawfiles = mongoose.model('Rawfiles'),
    Dataconnection = mongoose.model("Dataconnection"),
    ProjectDiscussion = mongoose.model('ProjectDiscussion'),
    Scheduler = mongoose.model('Scheduler'),
    Plans = mongoose.model('plans'),
    timseriesGroup = mongoose.model('tsGroup'),
    multer = require('multer'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    osChecker = require("../../../../utils/general/oschecker.utils.server"),
    UserModule = require('../../../users/server/controllers/admin.server.controller'),
    csv = require('fast-csv'),
    fs = require('fs'),
    fsx = require('fs-extra')
os = require('os'),
    archiver = require('archiver'),
    rmdir = require('rimraf'),
    config = require("../../../../config/config"),
    _ = require("lodash");
var Unzipper = require("decompress-zip");
var socket = require("../../../../utils/socket/core.socket.utils");
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var destination = './projects/';
//pscore host details
var pscoreHost = require("../../../../config/env/pscore.config");
var Dir = process.env.DATA_DIR || 'projects';
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var pc = this;
const moment = require('moment');
const basicSubscription = require('../../../../config/env/plans/basic-subscription');
const proSubscription = require('../../../../config/env/plans/pro-subscription');
const FeedbackSurvey = mongoose.model('feedbacksurvey');
var date = Date(Date.now());
date = date.toString();
/**
 * Function to check the projects limit.
 * @param {*} callback 
 */
function checkProjectLimit(isPsLite, req) {
    return new Promise(function (resolve, reject) {
        if (config.app.type === 'enterprise' && !config.license.projectLimit) {
            return resolve(true);
        }
        let userList = [];
        let query;
        let userPlanType;
        let userQuery;
        if (!req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
            userQuery = { subscription: req.subscription._id }
        } else {
            userQuery = {}
        }
        User.find(userQuery).exec(function (err, user) {
            user.forEach(function (item) {
                userList.push(item._id);
            });
            if (isPsLite) {
                query = { createdBy: req.user._id };
            } else if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
                userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
                query = {
                    createdBy: {
                        $in: userList
                    },
                    isDeleted: false
                }
            } else {
                query = {
                    isDeleted: false
                }
            }
            ProjectConfig.countDocuments(query).exec(function (err, count) {
                if (err) {
                    logger.error("Unable to get count of projects" + ' error: ' + err, { Date: date });
                    return resolve(false);
                } else {

                    //the request is from ps-lite
                    if (isPsLite) {
                        return resolve(count >= config.usecaseLimit);
                    } else if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin')) {
                        let data = null;
                        let projectLimit = null;
                        let feedbackProjectReward = null;
                        Plans.findOne({ planType: userPlanType }, function (err, planTemplateData) {
                            if (err) {
                                logger.error('Can not add new Plan to the plans collection', { Date: date })
                                return res.status(400).send(err.message);
                            }
                            data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'project');
                            data.rules.find(item => {
                                if (item.name === 'projectCount') {
                                    projectLimit = item.allowedValues;
                                }
                            });
                            feedbackModuleData = planTemplateData.restrictionPlans.find(val => val.moduleName === 'feedback');
                            feedbackModuleData.rules.find(item => {
                                if (item.name === 'numberofprojectsforreward') {
                                    feedbackProjectReward = item.allowedValues;
                                }
                            });
                            if (req.subscription?.planDuration === 'yearly') {
                                projectLimit = (Number(projectLimit) * 12) + 5;
                            }
                            // check if the user has submitted the survey and reward the extra projects.
                            FeedbackSurvey.countDocuments({ subscriptionId: req?.subscription?._id, surveyType: 'rewardSurvey' }).exec(function (error, surveyCount) {
                                if (err) {
                                    logger.error("Unable to get count of survey" + ' error: ' + err, { Date: date });
                                    return resolve(false);
                                } else if (surveyCount) {
                                    projectLimit = Number(projectLimit) + Number(feedbackProjectReward);
                                    return resolve(count >= projectLimit);
                                } else {
                                    return resolve(count >= projectLimit);
                                }
                            });
                        });
                        // if (userPlanType === "pro") {
                        //     projectLimit = proSubscription.project.limits.projectLimit;
                        // } else if (userPlanType === "basic") {
                        //     projectLimit = basicSubscription.project.limits.projectLimit;
                        // }
                    } else {

                        return resolve(count >= config.license.projectLimit);
                    }
                }
            });
        });
    })
}

/**
 * Create Project Configuration
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    //If the request is from ps-lite read 
    const isReqFromPsLite = req.query['isReqFromPsLite'] || false;
    //Check project limit reached or not.
    checkProjectLimit(isReqFromPsLite, req).then(function (limitReached) {
        if (limitReached) {
            logger.error('Projects limit reached', { Date: date })
            return res.status(400).send({ message: "Projects limit reached!" });
            // reject({ message: "Projects limit reached!" });
        } else {
            var projectConf = req.body;
            projectConf.createdBy = req.user._id;
            projectConf.projectStatus = "Project Created";
            createNewProject(projectConf).then(function (data) {
                res.json(data)
            })
        }
    })
        //Catch the erros
        .catch(function (err) {
            logger.error('Could not create project' + ' error: ' + err, { Date: date })
            return res.status(400).send(err);
        })
};

//function to call the create project python api
function createProjectCallFromPython(data) {
    return new Promise(function (resolve, reject) {
        var options = {
            uri: ps_core_server_url + '/api/create/project',
            method: 'POST',
            json: data
        };

        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }

        });
    });
}

function createNewProject(projectConf) {
    return new Promise(function (resolve, reject) {
        var project = new ProjectConfig(projectConf);
        project.save().then(function (project) {
            var data = {
                pId: project._id,
                absPath: __basedir
            }

            var datas = {
                projectId: project._id,
                created_by: project.createdBy,
                name: '/',
                oldDataGroupId: projectConf.oldDataGroupId
            }
            var dataGroup = new DataGroup(datas);
            dataGroup.save(function (err) {
                createProjectCallFromPython(data).then(function (response) {
                    if (response.statusCode != 200) {
                        reject(err)
                    } else {
                        var log = {
                            projectId: project._id,
                            userId: project.createdBy,
                            level: "info",
                            message: "project directory created"
                        }
                        logger.info('project directory created' + ' projectId: ' + project._id + ' userId: ' + project.createdBy, { Date: date })
                        auditLogger.logit(log);
                        resolve(project)
                    }
                }, function (err) {
                    project.deleteOne(function (err) {
                        if (err) {
                            logger.error('Could not create project' + ' error: ' + err, { Date: date })
                            reject({ message: "Cloud not create project,server error." })
                        } else {
                            reject({ message: "Could not create the project,server error." });
                        }
                    });
                });
            });

        }, function (err) {
            logger.error("Could not create project " + ' error: ' + err, { Date: date });
            reject({ message: "Could not create project", err: err })
        })
    })

}
function nextFunction(Dir, project, res) {
    var projectDirName;
    if (os.platform().toString().indexOf('win32') !== -1) {
        //windows
        projectDirName = Dir + '\\' + project._id
    } else {
        //linux
        projectDirName = Dir + '/' + project._id
    }
    fs.mkdir(projectDirName, function (error) {
        if (error) {
            console.log(error);
        } else {
            var log = {
                projectId: project._id,
                userId: project.createdBy,
                level: "info",
                message: "project directory created"
            }
            logger.info('project directory created' + ' projectId: ' + project._id + ' userId: ' + project.createdBy, { Date: date })
            auditLogger.logit(log);
            res.json(project)
        }
    });
}


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dest = null
        if (req.query.hasOwnProperty('uploadType')) {
            dest = destination + req.destination;
            if (!fs.existsSync(destination)) {
                var data = {
                    absPath: __basedir
                }
                createProjectCallFromPython(data).then(function (response) {
                    if (response.statusCode == 200) {
                        if (!fs.existsSync(dest)) {
                            fs.mkdirSync(dest);
                        }
                        callback(null, dest);
                    } else {
                        console.log('Could not create Project, server error');
                    }
                }, function (err) {
                    logger.error('Couldnot create project' + ' error: ' + err, { Date: date })
                    console.log('Could not create Project, server error');
                });
            } else {
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest);
                }
                callback(null, dest);
            }
        } else {
            dest = destination + req.project._id;
            callback(null, dest);
        }
    },
    filename: function (req, file, callback) {
        if (req.query.hasOwnProperty('uploadType')) {
            // dest = destination;
            // var ext = path.extname(file.originalname);
            callback(null, file.originalname);
        } else {
            var ext = path.extname(file.originalname);
            callback(null, file.fieldname + '-' + req.project._id + '-' + Date.now() + ext);
        }

    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        var excludes = ['.csv', '.zip', '.xlsx', '.xls', '.pkl', '.pk', '.pl', 'pickle'];
        if (!_.includes(excludes, ext)) {
            return callback(new Error('Uploaded file format is not supported!'))
        }
        callback(null, true)
    }
}).single('file');

exports.readFileData = function (req, res) {
    var isDataTypeRequired = req.query.isDataTypeRequired ? req.query.isDataTypeRequired : false;
    var data = {
        filePath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.body.filepath }),
        fileExtension: path.extname(req.body.filepath),
        fileEncoding: req.project.fileEncoding,
        numRows: req.query.numRows || 5
    }
    var options = {
        uri: ps_core_server_url + '/api/data/get_preview',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Can not read file' + ' error: ' + error, { Date: date })
            res.status(400).json(response.body)
        } else {
            res.json(response.body)
        }
    });
    //var stream = fs.createReadStream(path.resolve(req.body.filepath));
    //var csvData  = [];
    //var heading = [];
    //var obj = {};
    //var csvStream = csv();
    //var rows = []
    //var onData = function(row) {
    //    rows.push(row);
    //    if (rows.length == 10) {
    //        csvStream.emit('doneReading'); //custom event for convenience
    //    }else{
    //        if(rows.length==1){
    //            heading = rows[0];
    //        }else{
    //            obj = {};
    //            for(var k = 0;k<heading.length;k++){
    //                obj[heading[k]] = row[k];
    //            }
    //            csvData.push(obj);
    //        }
    //    }
    //}
    //csvStream.on("data",onData).on("doneReading",function(){
    //    stream.close();
    //    csvStream.removeListener('data',onData);
    //    return res.json({status:'success',previewData:csvData,head:heading});
    //})
    //csvStream.on("end", function(){
    //
    //});
    //stream.pipe(csvStream);
}
/**
 * Function will pass url to pscore and it will start pulling the data
 */
exports.pullData = function (req, res) {
    var data = req.body;
    data.projectFolderPath = path.resolve(Dir)
    data.projectId = req.project._id;
    data.createdBy = req.project.createdBy;
    var options = {
        uri: ps_core_server_url + '/api/data/pull',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            res.status(400).json(response.body)
        } else {
            var resp = response.body;
            var update = {
                projectStatus: resp.projectStatus,
            }
            ProjectConfig.updateOne({ _id: data.projectId }, {
                $set: update
            }, function (err, affected, data) {
                if (err) {
                    logger.error('Could not update project info!' + ' error: ' + err, { Date: date });
                    return res.status(400).send({ message: 'Could not update project info!' })
                }
                res.json(resp)
            })

        }
    });
}
/**
 * 
 */
exports.pullDataDone = function (req, res) {
    var data = req.body;
    var update = null;
    if (data.projectStatus == 'Upload Failed') {
        update = {
            projectStatus: data.projectStatus
        }
    } else {
        update = {
            projectStatus: data.projectStatus,
            filename: data.dataFilepath,
            originalFileName: data.name ? data.name : path.basename(data.dataFilepath),
            fileType: data.dataFilepath ? path.extname(data.dataFilepath) : null,
            fileSize: data.fileSize
        }
    }
    ProjectConfig.updateOne({ _id: data.projectId }, {
        $set: update
    }, function (err, affected, doc) {
        if (err) {
            logger.error('Error occurred while saving to database' + ' projectId: ' + data.projectId + ' createdBy: ' + data.createdBy, { Date: date });
            socket.emit("pullData", { status: "db_update_failed", projectId: data.projectId }, { _id: data.projectId, createdBy: data.createdBy });
        } else {
            var dataToUI = {
                projectStatus: data.projectStatus,
                projectId: data.projectId,
                file: data.dataFilepath,
                fileSize: data.fileSize,
                originalFileName: update.originalFileName
            }
            logger.info('pullData' + ' projectId: ' + data.projectId + ' createdBy: ' + data.createdBy, { Date: date });
            socket.emit("pullData", dataToUI, { _id: data.projectId, createdBy: data.createdBy });
        }
        res.json({ message: "Received data" })
    })

}
exports.upload = function (req, res) {
    // req.file.encoding = req.query.fileEncoding;
    upload(req, res, function (err) {
        if (err) {
            var log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "error",
                message: "file upload failed"
            }
            logger.error('File upload failed', {
                projectId: req.project._id,
                userId: req.project.createdBy,
                Date: date
            });
            auditLogger.logit(log);
            return res.end(err);
        }
        var fileToBeDeleted = req.project.filename;
        //validation for no of rows and columns for pslite
        uploadUtil.validationForPsLite(req).then(resText => {
            //Find the uploaded file type
            var fType = path.extname(req.file.originalname);
            var fileToSave, insideFolder = '';
            if (fType == '.zip') {
                var filepath = path.join(req.file.destination, req.file.filename);
                var unzipper = new Unzipper(filepath);
                unzipper.on('error', function (err) {
                    logger.error('Caught an error' + ' error: ' + err, { Date: date });
                    console.log('Caught an error', err);
                });

                //Once extraction is completed it will emit this event
                unzipper.on("extract", function (result) {
                    //Remove the zip file
                    var zipfileToBeDeleted = path.join(req.file.destination, req.file.filename);
                    deleteFile(zipfileToBeDeleted)
                    //Extraction result,loop it and find csv file
                    result.forEach(function (item) {
                        if (item.deflated) {
                            fileToSave = item.deflated;
                            return;
                        } else if (item.folder) {
                            insideFolder = item.folder;
                        }
                    });
                    //Find the filepath  of extracted file
                    var extractedFileType = path.extname(fileToSave);
                    //Throw error if the extracted folder not contain supported file
                    var excludes = ['.csv', '.zip', '.xlsx', '.xls', '.pkl', '.pk', '.pl', 'pickle'];
                    if (!_.includes(excludes, extractedFileType)) {
                        return res.status(400).send({ message: "Could not find supported file" })
                    }

                    //Generating a new filename for extracted file.
                    var fName = path.basename(fileToSave)
                    var newFileName = req.project._id + Date.now() + fName;
                    var finalFileName = insideFolder + newFileName;
                    //File to rename
                    var pathToRename = req.file.destination + "/" + fileToSave;
                    //File name after rename
                    var pathToBeSaved = req.file.destination + "/" + finalFileName;
                    //Rename the extracted file
                    fs.rename(pathToRename, pathToBeSaved, function (err) {
                        if (err) throw err;
                        req.fileToSave = newFileName;
                        saveToDB(req, res, fileToBeDeleted)
                    });
                });
                unzipper.extract({ path: 'projects/' + req.project._id });
            } else {
                saveToDB(req, res, fileToBeDeleted);
            }
        }, e => {
            return res.status(400).send({ message: "The number of rows and columns allowed are " + config.uploads.fileUpload.limits.noOfRowsPermitForPsLite + " and " + config.uploads.fileUpload.limits.noOfColsPermitForPsLite + " respectively." })
        });
    });
};

function saveToDB(req, res, fileToBeDeleted) {
    //If the file uploaded for prediction
    if (req.query.type) {
        updateProjectConf(req, function (err, data) {
            if (data) {
                var metaData = {
                    fileType: path.extname(req.file.originalname),
                    filepath: req.file.filename,
                    fileSize: req.file.size,
                    originalFileName: req.file.originalname,
                    fileEncoding: req.query.fileEncoding
                }
                return res.json({ status: 'success', id: req.project._id, previewData: req.csvData, projectDetails: metaData });
            }
        });
    } else {
        var filepath = req.fileToSave ? req.fileToSave : req.file.path;
        readDataFromCsv(filepath, function (err, data) {
            if (err) {
                logger.error("Error while checking duplicate column name entry" + ' error: ' + err, { Date: date });
            }
            if (filterDuplicateCoumn(data[0]).length) {
                deleteWrongFile(req.file.path, function (err, status) {
                    if (status) {
                        logger.info("File with duplicate column deleted successfully", { Date: date });
                    }
                })
                res.status(400).send({ message: "Identified duplicate column names in the uploaded file" })
            } else {
                req.csvData = data;
                updateProjectConf(req, function (err, data) {
                    if (data) {
                        req.project.filename = req.file.filename;
                        req.project.fileSize = req.file.size;
                        req.project.originalFileName = req.file.originalname;
                        req.project.fileType = path.extname(req.file.originalname);
                        req.project.projectStatus = "File Uploaded";
                        deleteFile(fileToBeDeleted)
                        //If there is a flow execute the flow
                        if (req.project.flowId && req.project.flowId != 'clear') {

                            pc.executeFlow({ project: req.project, filePath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.body.filepath }), destination: destination + req.project._id, basedir: config.projectDir })
                            return res.json({ status: 'flow_start', filename: req.file.filename, id: req.project._id, previewData: req.csvData, projectDetails: req.project });
                            //return res.json({status:'flow_start',id:req.project._id,previewData:[],projectDetails:req.project});
                        } else {
                            return res.json({ status: 'success', filename: req.file.filename, id: req.project._id, previewData: req.csvData, projectDetails: req.project });
                        }


                    }
                });
            }
        })
    }
}
exports.executeFlow = function (params) {
    fs.readFile('./node-red/flows/psflow.json', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        else {
            var flows = JSON.parse(data);
            flows.forEach(function (selectedFlowObject) {
                if (selectedFlowObject.z === params.flowId) {
                    var id = selectedFlowObject.id;
                    var msg = {};
                    msg.projectId = params.projectId;
                    msg.createdBy = params.createdBy;
                    msg.destination = params.destination;
                    msg.filePath = params.filepath || "";
                    msg.dataGroupId = params.dataGroupId || null;
                    msg.dataConnId = params.dataConnId || null;
                    msg.lastFetch = params.lastFetch || null;
                    msg.filename = params.filename || null;
                    msg.basedir = params.basedir;
                    msg.uniqueFlowId = params.uniqueFlowId || null;

                    if (selectedFlowObject.type == 'ps_inject_node') {
                        var RED = require(path.resolve("./config/config")).RED;
                        var injector = require("../../../../node-red/packages/node_modules/@node-red/nodes/ps_inject_node")(RED, true, function (flowExecuter) {
                            flowExecuter(msg, id);
                        });
                    }
                    //var node = RED.nodes.getNode(id);
                    // if (node.type == 'file in')
                    //     params.filePath ? node.filename = path.resolve(params.filePath) : '';

                    // node.receive(msg)

                }
            });
        }
    });

}
//udd data dum logic
exports.dumpData = function (msg) {
    if (msg.payload) {
        var finalArray = JSON.stringify(msg.payload)
        var finalFilePath = path.join(msg.destination, msg.projectId + '-' + Date.now() + ".json");
        fs.appendFile(finalFilePath, finalArray, function (err) {
            if (err) {
                socket.emit("uddFlowCompleted", { status: "failed", projectId: msg.projectId }, { _id: msg.projectId, createdBy: msg.createdBy });
                throw err;
            }
            var update = {
                projectStatus: "File Uploaded",
                filename: finalFilePath,
                fileType: path.extname(finalFilePath)
            }
            ProjectConfig.updateOne({ _id: msg.projectId }, {
                $set: update
            }, function (err, affected, resp) {
                // callback(null,true)
                if (err) {
                    socket.emit("uddFlowCompleted", { status: "db_update_failed", projectId: msg.projectId }, { _id: msg.projectId, createdBy: msg.createdBy });
                } else {
                    socket.emit("uddFlowCompleted", { status: "complted", projectId: msg.projectId, file: finalFilePath }, { _id: msg.projectId, createdBy: msg.createdBy });
                }
            })

        })
    }
    // else{
    //     socket.emit("uddFlowCompleted",{status:"flow_failed",projectId:msg.projectId},{_id:msg.projectId,createdBy:msg.createdBy}); 
    // }
}
/**
 * Function to delete an old uploaded file.
 * @param req
 * @param res
 * @param next
 */
function deleteFile(fileToBeDeleted) {
    if (fileToBeDeleted) {
        fs.unlink(fileToBeDeleted, function (err) {
            if (err && err.code == 'ENOENT') {
                // file doens't exist
                logger.info("File doesn't exist, won't remove it.", { Date: date });
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                logger.error("Error occurred while trying to remove file", { Date: date });
            } else {
                logger.info("File removed", { Date: date });
            }
        });
    }
}

/**
 * Function to find the duplicate columns in the csv header
 * @param header,pass the csv header
 * @returns {Array}
 */
function filterDuplicateCoumn(header) {
    var duplicate = _.filter(header, function (value, index, iteratee) {
        return _.includes(iteratee, value, index + 1);
    });
    return duplicate;
}

/**
 * Delete the uploaded file which contains duplicate column name
 */
function deleteWrongFile(filepath, callback) {
    fs.unlink(path.resolve(filepath), function (err, data) {
        if (err) {
            logger.error("Could not delete file with duplicate column name" + ' error: ' + err, { Date: date });
        }
        callback(null, true);
    });
}

/**
 * Function read the data from csv
 */
function readDataFromCsv(filepath, callback) {
    //var stream = fs.createReadStream(filepath);
    //var csvStream = csv()
    //var onData;
    //var rows = [];
    //onData = function(row) {
    //    rows.push(row);
    //    if (rows.length == 10) {
    //        csvStream.emit('doneReading'); //custom event
    //    }
    //}
    //csvStream.on("data",onData).on("doneReading",function(){
    //    stream.close();
    //    csvStream.removeListener('data',onData);
    //    callback(null,rows)
    //})
    //csvStream.on("end", function(){
    //
    //});
    //stream.pipe(csvStream);
    var rows = [];
    callback(null, rows)
}

/**
 * Function to check duplicate header
 */
function isDuplicateColExist(filepath, callback) {
    var stream = fs.createReadStream(filepath);
    var i = 0;
    var header = [];
    var csvStream = csv()
        .on("data", function (row) {
            if (i < 1) {
                var dulicate = _.filter(row, function (value, index, iteratee) {
                    return _.includes(iteratee, value, index + 1);
                });
                callback(null, dulicate)
            } else {
                return 0;
            }
            i++;
        })
        .on("end", function () {

        });

    stream.pipe(csvStream);
}
/**
 * List all Projects
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    ProjectConfig.find({ $or: [{ createdBy: req.user._id, isDeleted: false }, { sharedWith: req.user._id, isDeleted: false }] }).exec(function (err, project) {
        if (err) {
            logger.error("Could not find projects" + ' error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not find project" });
        } else {
            res.json(project);
        }
    })
};


/**
 * List specified Project
 * @param req
 * @param res
 */
exports.read = function (req, res) {
    ProjectConfig.find({ $or: [{ createdBy: req.user._id, _id: req.project._id }, { sharedWith: req.user._id, _id: req.project._id }] }).exec(function (err, project) {
        if (err) {
            logger.error("Could not find Strain configurations" + ' error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not find project" });
        } else {
            res.json(project);
        }
    })
};
/*
* Report project status
 */
exports.reportStatus = function (req, res) {
    var projectStatusDetails = [];
    if (req.project.projectStatusDetails) {
        projectStatusDetails = req.project.projectStatusDetails;
    }
    projectStatusDetails.push({ error: req.body.error, algoName: req.body.algoName });
    ProjectConfig.updateOne({ _id: req.project._id }, {
        projectStatus: req.body.projectStatus,
        projectStatusDetails: projectStatusDetails
    }, function (err, affected, resp) {
        if (err) {
            logger.error("Could not update project status send by core" + ' error: ' + err, { Date: date });
            var log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "error",
                message: "Could not update project status send by core"
            }
            auditLogger.logit(log);
            res.status(400).send({ message: "Could not update project status send by core" });
        }
        var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: "info",
            message: req.body.error
        }
        logger.info('Eda completed' +
            ' projectId: ' + req.project._id +
            ' userId: ' + req.project.createdBy
            , { Date: date });
        auditLogger.logit(log);
        socket.emit("edaCompleted", { projectStatus: req.body.projectStatus }, req.project);
        res.json(req.project);
    })
}
/**
 * Update Project configuration
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var data = req.body;
    if (!data) {
        logger.error('Could not update project details', { Date: date });
        return res.status(400).send({ message: "Could not update project details" });
    }
    var update = {};

    if (data.name) {
        update = {
            name: data.name,
            projectDescription: data.projectDescription
        }
    } else {
        if (data.flowId) {
            update = {
                flowId: data.flowId
            }
            req.project.flowId = data.flowId;
        } else if (data.hasOwnProperty('useGPU')) {
            update = {
                useGPU: data['useGPU']
            }
        } else if (data.hasOwnProperty('stdThreshold')) {
            update = {
                stdThreshold: data['stdThreshold']
            }
        } else {
            update = {
                fileEncoding: data.fileEncoding
            }
        }
    }
    ProjectConfig.updateOne({ _id: req.project._id }, {
        $set: update
    }, function (err) {
        if (err) {
            logger.error("Could not update project details " + ' error: ' + err, { Date: date });
            if (res)
                return res.status(400).send({ message: "Could not update project details" });
            else
                return callback({ message: "Could not update project details" })
        } else {
            req.project = Object.assign(req.project, data);
            res.json(req.project);
        }
    });
};

function updateProjectConf(req, callback) {
    var update = {}
    //If the file uploaded for prediction
    if (req.query.type) {
        update = {
            predictionFileMetaData: {
                filepath: req.file.filename,
                fileSize: req.file.size,
                originalFileName: req.file.originalname,
                fileType: path.extname(req.file.originalname),
                fileEncoding: req.query.fileEncoding
            }
        }
    } else {
        var uploadCount = (req.project.uploadCount * 1) + 1;
        update = {
            filename: req.fileToSave ? req.fileToSave : req.file.filename,
            fileSize: req.file.size,
            originalFileName: req.file.originalname,
            fileType: path.extname(req.file.originalname),
            projectStatus: "File Uploaded",
            uploadCount: uploadCount
        }
    }
    ProjectConfig.updateOne({ _id: req.project._id }, {
        //filename: req.file.path,
        //fileSize: req.file.size,
        //originalFileName:req.file.originalname,
        //fileType:path.extname(req.file.originalname),
        //projectStatus:"File Uploaded",
        //uploadCount:uploadCount
        $set: update
    }, function (err, affected, resp) {
        if (err) {
            var log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "error",
                message: "Could not update project Configuration"
            }
            logger.error('Could not update project Configuration' + ' projectId: ' + req.project._id + ' userId: ' + req.project.createdBy, { Date: date });
            auditLogger.logit(log);
            res.status(400).send({ message: "Could not update project Configuration" });
        }
        var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: "info",
            message: "file uploaded sucessfully updated the database"
        }
        logger.info('file uploaded sucessfully updated the database' + ' projectId: ' + req.project._id + ' userId: ' + req.project.createdBy, { Date: date });
        auditLogger.logit(log);
        callback(null, true)
    })
}

/**
 * Delete Project Configuration
 * @param req
 * @param res
 */
exports.delete = function (req, res, callback) {
    if (req.project.createdBy.equals(req.user._id)) {
        if (config.app.type == 'saas' && req.query.deleteType == 'soft') {
            var query = req.project._id;
            ProjectConfig.updateOne({ _id: req.project._id, createdBy: req.project.createdBy }, {
                isDeleted: 'true'
            }, function (err) {
                if (err) {
                    logger.error("Could not delete Project Configuration " + 'error:' + err, { Date: date });
                    if (res) {
                        res.status(400).send({ message: "Could not delete project Configuration" });
                    } else {
                        callback({ message: "Could not delete project Configuration" });
                    }
                } else {
                    removeDataConnection(req.project, function (err, data) {
                        return res.send({ message: 'Project files deleted' });
                    })
                    // res.status(200).send();

                }
            });
        } else if (config.app.type == 'enterprise') {
            deleteProjectData(req.project, function (err, data) {
                if (err) {
                    logger.error('could not delete project' + err, { Date: date });
                    return res.status(400).send({ message: err.message });
                }
                return res.send({ message: 'Project files deleted' });
            });

        } else if (config.app.type == 'saas' && req.query.deleteType == 'hard') {
            deleteProjectData(req.project, function (err, data) {
                if (err) {
                    logger.error('could not delete project' + err, { Date: date });
                    return res.status(400).send({ message: err.message });
                }
                return res.send({ message: 'Project files deleted' });
            })
        }
    } else {
        logger.info('Shared projects can be deleted by owner', { Date: date });
        return res.send({ message: 'Shared projects can be deleted by owner' });
    }

};


function deleteProjectData(project, callback) {
    ProjectConfig.deleteOne({
        _id: project._id
    }, function (err) {
        if (err) {
            logger.error("Could not delete Project Configuration " + 'error:' + err, { Date: date });
            if (res) {
                callback({ message: "Could not delete project Configuration" }, null);
            } else {
                callback({ message: "Could not delete project Configuration" });
            }
        } else {
            var projectDirName = project._id,
                path;
            if (os.platform().toString().indexOf('win32') !== -1) {
                //windows
                path = Dir + '\\' + projectDirName;
            } else {
                //linux
                path = Dir + '/' + projectDirName;
            }
            rmdir(path, function (err) {
                if (err) {
                    logger.error('Error while deleting project directory' + ' error: ' + err, { Date: date });
                    callback({ message: 'Project file deleted from disk' }, null)
                }
                else {
                    removeDataConnection(project, function (err, data) {
                        var dataconnectionData = Dataconnection.deleteMany({ projectId: project._id }).exec();
                        var filesData = Files.deleteMany({ projectId: project._id }).exec();
                        var rawFilesData = Rawfiles.deleteMany({ projectId: project._id }).exec();
                        var edaData = Eda.deleteMany({ projectId: project._id }).exec();
                        var trainingData = Trainings.deleteMany({ projectId: project._id }).exec();
                        var modelData = Models.deleteMany({ projectId: project._id }).exec();
                        var dataDriftData = DataDrift.deleteMany({ projectId: project._id }).exec();
                        var driftConfig = DriftConfig.deleteMany({ projectId: project._id }).exec();
                        var dataGroup = DataGroup.deleteMany({ projectId: project._id }).exec();
                        Promise.all([dataconnectionData, filesData, rawFilesData, edaData, trainingData, modelData, dataDriftData, driftConfig, dataGroup]).then(function (files) {
                            logger.info("Project Configuration deleted ", { Date: date });
                            callback(null, { message: 'Project data deleted' })
                        }).catch(function (err) {
                            logger.error('Project data could not be removed' + ' error: ' + err, { Date: date });
                            callback(null, { message: 'Project data could not be deleted' })
                        });
                    })
                }
            });
        }
    });
}

function removeDataConnection(project, callback) {
    Dataconnection.find({ projectId: project._id, isDeleted: false }, function (err, docs) {
        if (err) {
            logger.error('Could not find data' + ' error: ' + err, { Date: date });
            callback({ message: 'Could not find data!', err: err }, null);
        }
        var list = docs;
        for (var i = 0; i < list.length; i++) {
            var schedulerId = list[i]._id;
            if (list[i].scheduleId) {
                Scheduler.findById(list[i].scheduleId, function (err, doc) {
                    if (err) {
                        logger.error('Could not find task' + ' error: ' + err, { Date: date });
                        callback({ message: 'Could not find task' }, null);
                    }
                    var task = doc.tasks.filter(function (item) {
                        return item.taskId.equals(schedulerId);
                    });
                    doc.tasks.id(task[0]._id).remove();
                    doc.save(function (err, scheduler) {
                        if (err) {
                            logger.error('Could not remove task from scheduler', { Date: date })
                            callback({ message: 'Could not remove task from scheduler' }, null);
                        }
                    })
                })
            }

        }
        callback(null, { message: 'Scheduler removed from dataconnection' })
    })
}
/**
 * Function to merge data coming from toolkit with training data
 */
exports.mergeData = function (req, res) {
    if (!req.query.mtype) {
        return res.status(400).send({ message: "missing mtype!" });
    }
    if (!req.query.encoding) {
        return res.status(400).send({ message: "missing encoding!" });
    }
    if (req.query.mtype == 'file') {

        //if mtype if file, from toolkit we are getting data as a file.
        upload(req, res, function (err) {
            if (err) {
                var log = {
                    projectId: req.project._id,
                    userId: req.project.createdBy,
                    level: "error",
                    message: "file upload failed"
                }
                auditLogger.logit(log);
                return res.end(err);
            }

            //Find the uploaded file type
            var fType = path.extname(req.file.originalname);

            /**
             * If file there is no file exist, upload it and update the details to databse.
             */
            if (!req.project.filename) {
                var update = {
                    filename: path.resolve(req.file.path),
                    originalFileName: req.file.originalname,
                    fileType: path.extname(req.file.path),
                    fileEncoding: req.project.fileEncoding ? req.project.fileEncoding : 'utf_8',
                    fileSize: req.file.size,
                    projectId: req.project._id,
                    projectStatus: 'File Uploaded'
                }
                updateProjectInfo(update, function (err, data) {
                    if (err) {
                        logger.error('Could not update project details' + ' error: ' + err, { Date: date })
                        return res.status(400).send({ message: 'Could not update project details!' })
                    } else {
                        return res.json({ status: 'success', data: update })
                    }
                })
            } else {
                /**
                 * If some file exist merge pass it to pscore along with new file path to merge
                 */
                var data = {
                    data: {
                        // mergeFilePath: path.resolve(req.file.path),
                        mergeFilePath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.file.filename }),
                        encoding: req.query.encoding,
                        fileExt: path.extname(req.file.path)
                    },
                    mtype: req.query.mtype,
                    projectDetails: {
                        projectId: req.project._id,
                        originalFilePath: req.project.filename ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.project.filename }) : null,
                        createdBy: req.project.createdBy,
                        fileExt: req.project.fileType ? req.project.fileType : null,
                        encoding: req.project.fileEncoding ? req.project.fileEncoding : null,
                        projectFolderPath: path.resolve(Dir)
                    }
                }
                var options = {
                    uri: ps_core_server_url + '/api/data/merge',
                    method: 'POST',
                    json: data
                };
                request(options, function (error, response, body) {
                    if (response.statusCode != 200) {
                        res.status(400).json(response.body)
                    } else {
                        //If from=psense is present format the response for PredictSense UI
                        if (req.query.from) {
                            return res.json({ status: 'success', filename: path.resolve(req.project.filename), id: req.project._id, previewData: req.csvData, projectDetails: req.project });
                        } else {
                            res.json({ status: 'success', message: 'Please refresh the PredictSense app', data: response.body })
                        }

                    }
                });

            }

        });
    } else {

        //json format

        var data = {
            data: req.body,
            mtype: req.query.mtype,
            projectDetails: {
                projectId: req.project._id,
                originalFilePath: req.project.filename ? path.resolve(req.project.filename) : null,
                createdBy: req.project.createdBy,
                fileExt: req.project.fileType ? req.project.fileType : null,
                encoding: req.project.fileEncoding ? req.project.fileEncoding : null,
                projectFolderPath: path.resolve(Dir)
            }
        }
        var options = {
            uri: ps_core_server_url + '/api/data/merge',
            method: 'POST',
            json: data
        };
        request(options, function (error, response, body) {
            if (response.statusCode != 200) {
                res.status(400).json(response.body)
            } else {
                var data = response.body;
                var update = {};
                //If operation is new_file, update the file details to database.
                if (data.operation == 'new_file') {
                    update = {
                        filename: data.filePath,
                        originalFileName: data.fileName,
                        fileType: data.fileType,
                        fileEncoding: data.fileEncoding,
                        fileSize: data.fileSize,
                        projectId: data.projectId,
                        projectStatus: 'File Uploaded'
                    }

                } else {
                    update = {
                        fileSize: data.fileSize,
                        projectId: data.projectId,
                        projectStatus: 'File Uploaded'
                    }
                }
                updateProjectInfo(update, function (err, data) {
                    if (err) {
                        logger.error('Could not update project details!' + ' error: ' + err, { Date: date });
                        return res.status(400).send({ message: 'Could not update project details!' })
                    } else {
                        return res.json({ status: 'success', message: 'Please refresh the PredictSense app', data: update })
                    }
                })
            }
        });
    }
}
function updateProjectInfo(updateData, callback) {
    ProjectConfig.updateOne({ _id: updateData.projectId }, {
        $set: updateData
    }, function (err, rowsAffected) {
        if (err) {
            callback(err, null)
        } else {
            callback(null, { status: 'updated' });
        }
    });
}
/**
 * API to share the project with another user by using email
 */
exports.shareProject = function (req, res) {
    var email = req.body.email ? req.body.email.toLowerCase() : null;
    UserModule.findUserByEmail(email, function (err, user) {
        if (err) {
            logger.error('Could not find any user with that email' + ' error: ' + err, { Date: date });
            return res.status(400).send({ message: 'Could not find any user with that email!.' });
        }
        //Update the projects sharedWith field.
        ProjectConfig.findByIdAndUpdate(req.project._id, {
            $addToSet: { sharedWith: user._id }
        }, function (err) {
            if (err) {
                logger.error('Could not share the project with the specified user' + ' error: ' + err, { Date: date });
                res.status(400).send({ message: 'Could not share the project with the specified user!.', err: err });
            }
            res.send({ message: 'success' });
        })
    });
}
/** 
 * API to get the discussions about a project
*/
exports.listConversation = function (req, res) {
    ProjectDiscussion.find({ projectId: req.project._id }, function (err, docs) {
        if (err) {
            logger.error('Error while fetching project conversations' + ' error: ' + err, { Date: date });
            return res.status(400).send({ message: 'Error while fetching project conversations!.', err: err });
        }
        res.send(docs);
    })
}
/**
 * API to create a message
 */
exports.createMessage = function (req, res) {
    var data = req.body;
    data.projectId = req.project.id;
    data.createdBy = req.user._id;
    var conversation = new ProjectDiscussion(data);
    conversation.save(function (err, doc) {
        if (err) {
            logger.error('Error while saving the message' + ' error: ' + err, { Date: date });
            return res.status(400).send({ message: 'Error while saving the message' });
        }
        // socket.emit('projectDiscussion',doc,{projectId:req.project._id,createdBy:req.user._id});
        res.send(doc);
    })
}
/**
 * API to delete a message from a conversation
 */
exports.deleteConversation = function (req, res) {
    if (req.message.createdBy != req.user._id) {
        return res.status(400).send({ message: 'Not authorized to delete this message!' });
    }
    ProjectDiscussion.find({ _id: req.message._id }).deleteOne(function (err) {
        if (err) {
            logger.error('Could not delete the message' + ' error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not delete the message!' });
        }
        res.send({ message: 'Message deleted.' });
    })
}

if (osChecker.checkOs() == "windows") {
    destination = '.\\projects\\';
} else {
    destination = './projects/';
}

exports.downloadProject = function (req, res) {
    var filepath = destination + req.project.name + '.zip';
    res.download(filepath, function (err) {
        if (err) {
            logger.error('Error while downloading project' + ' error: ' + err, { Date: date });
        }
        deleteFile(path.resolve(filepath));

    });
}
/**
 * API to export the project data
 */
exports.exportProject = function (req, res) {
    var project = req.project;
    var userId = req.user._id;
    var directoryName = project.name;
    var zipOutDir = pathGenerator() + directoryName + '.zip';
    var output = fs.createWriteStream(zipOutDir);
    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
        // res.download(zipOutDir);
        var dataToUI = {
            downloadUrl: zipOutDir
        }
        socket.emit("downloadLink", dataToUI, { createdBy: userId });
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
        console.log('On END called');
    });
    // good practice to catch this error explicitly
    archive.on('error', function (err) {
        logger.error('Error while archiving' + ' error: ' + err, { Date: date });
        console.error("Error while archiving")
        res.status(400).send(err)
    });
    // append files from a sub-directory and naming it `static` within the archive
    archive.directory(path.resolve(pathGenerator() + project._id), directoryName + '/' + project._id);
    archive.pipe(output);
    fetchAllProjectData({ projectId: project._id, flowId: project.flowId }, function (err, data) {
        //Project data
        if (project) {
            archive.append(JSON.stringify(project), { name: directoryName + "/project.json" });
        }
        //EDA data
        if (data[0]) {
            archive.append(JSON.stringify(data[0]), { name: directoryName + "/eda.json" });
        }
        //Training data
        if (data[1]) {
            archive.append(JSON.stringify(data[1]), { name: directoryName + "/training.json" });
        }
        archive.append(JSON.stringify(data[2]), { name: directoryName + "/uddflow.json" });
        archive.append(JSON.stringify(data[3]), { name: directoryName + "/auditlog.json" });
        archive.append(JSON.stringify(data[4]), { name: directoryName + "/edaprogress.json" });
        archive.append(JSON.stringify(data[5]), { name: directoryName + "/featurerepo.json" });
        archive.append(JSON.stringify(data[6]), { name: directoryName + "/sharedfeature.json" });
        archive.append(JSON.stringify(data[7]), { name: directoryName + "/models.json" });
        archive.append(JSON.stringify(data[8]), { name: directoryName + "/files.json" });
        archive.append(JSON.stringify(data[9]), { name: directoryName + "/datadrift.json" });
        if (data[10]) {
            archive.append(JSON.stringify(data[10]), { name: directoryName + "/dataconnection.json" });
        }
        archive.append(JSON.stringify(data[11]), { name: directoryName + "/datagroup.json" });
        if (data[12]) {
            archive.append(JSON.stringify(data[12]), { name: directoryName + "/rawfile.json" });
        }
        if (data[13]) {
            archive.append(JSON.stringify(data[13]), { name: directoryName + "/output.json" });
        }
        if (data[14]) {
            archive.append(JSON.stringify(data[14]), { name: directoryName + "/dataflow.json" });
        }
        if (data[15]) {
            archive.append(JSON.stringify(data[15]), { name: directoryName + "/driftconfig.json" });
        }
        if (data[16]) {
            archive.append(JSON.stringify(data[16]), { name: directoryName + "/notebookData.json" });
        }
        if (data[17]) {
            archive.append(JSON.stringify(data[17]), { name: directoryName + "/taExperimentsData.json" });
        }
        if (data[18]) {
            archive.append(JSON.stringify(data[18]), { name: directoryName + "/tsGroup.json" });
        }

        var configData = {
            projectData: 'project.json',
            edaData: 'eda.json',
            trainingData: 'training.json',
            uddData: 'uddflow.json',
            auditLogData: 'auditlog.json',
            edaProgressData: 'edaprogress.json',
            featureRepoData: 'featurerepo.json',
            sharedFeature: 'sharedfeature.json',
            modelsData: 'models.json',
            filesData: 'files.json',
            driftData: 'datadrift.json',
            dataconnection: 'dataconnection.json',
            datagroup: 'datagroup.json',
            rawfile: 'rawfile.json',
            output: 'output.json',
            dataflow: 'dataflow.json',
            driftConfig: 'driftconfig.json',
            notebookData: 'notebookData.json',
            taExperimentsData: 'taExperimentsData.json',
            tsGroup: 'tsGroup.json'
        };
        archive.append(JSON.stringify(configData), { name: directoryName + "/config.json" });
        archive.finalize();
    })

    archive.on('end', function () {
        res.send({ message: 'Started exporting task.' });
    })

}
function fetchAllProjectData(params, callback) {
    //Eda data for the project
    var edaData = Eda.find({ projectId: params.projectId });
    //Training data for the project
    var trainingData = Trainings.find({ projectId: params.projectId });
    //UDD data for the project
    var uddData = UddFlow.find({ _id: params.flowId });
    //Audit logs for the project
    var auditLogData = AuditLog.find({ projectId: params.projectId });
    //Eda progress data for the project
    var edaProgressData = EdaProgress.find({ projectId: params.projectId });
    //Feature repository data for project
    var featureRepoData = FeatureRepository.find({ projectId: params.projectId });
    //Shared features details for the project
    var sharedFeature = SharedFeature.find({ projectId: params.projectId });
    //Get trained models data
    var modelsData = Models.find({ projectId: params.projectId });
    //Get files data 
    var filesData = Files.find({ projectId: params.projectId });
    //Get drift reports
    var driftReports = DataDrift.find({ projectId: params.projectId });
    //Dataconnections for projects
    var dataConnections = Dataconnection.find({ projectId: params.projectId }).exec();
    //Datagroups for projects
    var dataGroup = DataGroup.find({ projectId: params.projectId }).exec();
    //Rawfiles for projects
    var rawFile = Rawfiles.find({ projectId: params.projectId }).exec();
    //output for projects
    var output = Output.find({ projectId: params.projectId }).exec();
    var dataflow = UddFlow.find({ projectId: params.projectId }).exec();
    //Get drift configs
    var driftConfigs = DriftConfig.find({ projectId: params.projectId });
    // Get notebook details
    var notebooks = Notebook.find({ projectId: params.projectId });
    // Get taExperiments data
    var taexperiments = Experiments.find({ projectId: params.projectId });
    //Get timeseries groupId
    var timeseriesGroupList = timseriesGroup.find({ projectId: params.projectId });
    Promise.all([edaData, trainingData, uddData, auditLogData, edaProgressData, featureRepoData, sharedFeature,
        modelsData, filesData, driftReports, dataConnections, dataGroup, rawFile, output, dataflow, driftConfigs, notebooks, taexperiments, timeseriesGroupList]).then(function (data) {
            var dataFlowArray = data[14];
            // Reads the psflow.json file and append all the flows which are in exporting project
            fs.readFile(
                "./node-red/flows/psflow.json",
                "utf8",
                function (err, psFlowData) {
                    if (err) throw err;
                    else {
                        var flowsArray = [];
                        var flows = JSON.parse(psFlowData);
                        dataFlowArray.filter(function (item) {
                            flows.forEach(function (obj) {
                                if ((obj.z === item.flowId || obj.id === item.flowId)) {
                                    flowsArray.push(obj);
                                }
                            });
                        });
                    }
                    data[2] = flowsArray;
                    callback(null, data);
                }
            );
        }).catch(function (err) {
            console.log("ERROR reading psflow.json")
        })
}
// Function will generate file path according to platform
function pathGenerator() {
    var filepath = null;
    if (osChecker.checkOs() == "windows") {
        filepath = destination;
    } else {
        filepath = destination;
    }
    return filepath;
}
/**
 * Function to import project
 */
exports.importProject = function (req, res) {
    var extractionPath = null;
    if (osChecker.checkOs() == "windows") {
        req.destination = config.projectUploadDir + '\\' + req.user._id;
        extractionPath = config.projectDir + '\\' + config.projectExtractionDir + '\\' + req.user._id;
    } else {
        req.destination = config.projectUploadDir + '/' + req.user._id;
        extractionPath = config.projectDir + '/' + config.projectExtractionDir + '/' + req.user._id;
    }
    if (req.query.hasOwnProperty('uploadType') && req.query.uploadType === 'importProject') {
        upload(req, res, function (err) {
            if (err) {
                console.log("UPLOAD ERR", err)
                // var log = {
                //     projectId:req.project._id,
                //     userId:req.project.createdBy,
                //     level:"error",
                //     message:"file upload failed"
                // }
                // auditLogger.logit(log);
                return res.status(400).send({ message: "Uploaded file format is not supported!" });
            }
            var filepath = path.join(req.file.destination, req.file.filename);
            // calling the function to unzip and import the project.
            unzipAndImportProject(filepath, extractionPath, req, res);
        });
    } else if (req.query.hasOwnProperty('uploadType') && req.query.uploadType === 'importTemplate') {
        req.file = {
            destination: './sampleprojects',
            filename: req.body.fileName
        }
        var filepath = path.join(req.file.destination, req.file.filename);
        // calling the function to unzip and import the project.
        unzipAndImportProject(filepath, extractionPath, req, res)
    }
}

/**
 * function to unzip the project zip files and import them.
 * @param filePath  - this the path of the zip file.
 */
function unzipAndImportProject(filepath, extractionPath, req, res) {
    let lenOfAllConfigData = 0;
    var unzipper = new Unzipper(filepath);
    unzipper.on('error', function (err) {
        console.log('Caught an error', err);
        return res.status(400).send({ message: "Project zip is corrupted!" });
    });

    //Once extraction is completed it will emit this event
    unzipper.on("extract", function (result) {
        //Remove the zip file
        var zipfileToBeDeleted = path.join(req.file.destination, req.file.filename);
        // check if upload type is import project call delete function.
        (req.query.uploadType === 'importProject') && deleteFile(zipfileToBeDeleted)
        //Read the config file from extracted files
        var location = null;
        var filename = req.file.filename.split("(")[0].trim();
        filename = filename.includes('.zip') ? filename : filename + '.zip';
        if (osChecker.checkOs() == 'windows') {
            location = extractionPath + '\\' + path.basename(filename, '.zip') + '\\'
        } else {
            location = extractionPath + '/' + path.basename(filename, '.zip') + '/'
        }
        // location = location.replace(/^\s+$/gm, '')
        var configFilePath = location + config.projectConfigFile;
        fs.readFile(path.resolve(configFilePath), function (err, configData) {
            if (err) {
                logger.error('Error while reading project config data' + ' error: ' + err, { Date: date });
                return res.status(400).send({ message: 'Error while reading project config data', err: err });
            }
            var configData = JSON.parse(configData);
            //Read the project data file and make an entry in the databse
            Object.keys(configData).map(function (key, index) {
                if (configData[key]) {
                    configData[key] = location + configData[key];
                } else {
                    delete configData[key];
                }
            })
            var filesContent = Object.keys(configData).map(function (key) {
                return readConfigFiles(configData[key], req.user._id);
            });
            //Resolve all promise
            Promise.all(filesContent).then(function (allConfigData) {
                //get project data from allConfigData
                var importedProjectId = allConfigData[0]._id;
                var importedProjectName = allConfigData[0].name;
                var projectData = allConfigData[0];
                var oldDataGroup = allConfigData[12];
                //Check project limit reached or not
                //fasle- the request is not from ps-lite
                //true- the request is from ps-lite
                checkProjectLimit(false, req).then(function (limitReached) {
                    if (limitReached) {
                        // reject({ message: "Projects limit reached!" });
                        // Deletes the uploaded folder from /projects/extracted folder
                        const deletePath = `${path.resolve(location).split(req.user._id)[0]}${req.user._id}`;
                        deleteFolder(deletePath);
                        return res.status(400).send({ message: "Projects limit reached!" });
                    } else {
                        delete projectData._id;
                        delete projectData.createdAt;
                        var projectConf = projectData;
                        projectConf.createdBy = req.user._id;
                        projectConf.isImported = true;
                        projectConf.oldDataGroupId = oldDataGroup[0]._id;
                        //If project limit is not reached create a new project
                        createNewProject(projectConf)
                            //Move extracted projects folder content to new project folder.
                            .then(function (newProjectDetails) {
                                //Save EDA datas
                                //allConfigData[1] -EDA data
                                allConfigData.forEach((item) => {
                                    if (item.length) {
                                        lenOfAllConfigData++;
                                    }
                                })
                                if (lenOfAllConfigData > 2) {
                                    return moveProjectFiles(newProjectDetails, importedProjectId, location, importedProjectName);
                                } else {
                                    return res.send({ message: 'Imported project is empty!' });
                                }
                            })
                            .then(function (newProjectDetails) {
                                //Save EDA datas
                                //allConfigData[1] -EDA data
                                allConfigData[0] = newProjectDetails;
                                return saveEdaData(newProjectDetails, allConfigData);
                            })
                            .then(function success(allConfigData) {
                                return saveDataGroup(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                //save files data
                                return saveFilesData(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                //Save training data
                                // res.send(allConfigData)
                                return saveTrainingData(allConfigData);
                            })
                            .then(function success(allConfigData) {
                                //Save the models metadata
                                return saveModelsData(allConfigData);
                            })
                            .then(function success(allConfigData) {
                                //Save auditLogData
                                return saveAuditLogData(allConfigData);
                            })
                            .then(function success(allConfigData) {
                                //Save Udd data
                                return saveEdaProgressData(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveDataDrift(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveDataConnection(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveRawFiles(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveOutput(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveUddFlow(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveDriftConfig(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                return saveNotebookData(allConfigData)
                            })
                            .then(function success(allConfigData) {
                                //save experiments data to db
                                return saveExperimentsData(allConfigData)
                            }).then(function success(allConfigData) {
                                //save experiments data to db
                                return saveTimeseriesGroupData(allConfigData)
                            })
                            .then(function success() {
                                res.send({ message: 'Project imported successfully!' });
                            }).catch(function (err) {
                                console.log(err)
                                // Deletes the uploaded folder from /projects/extracted folder
                                const deletePath = `${path.resolve(location).split(req.user._id)[0]}${req.user._id}`;
                                deleteFolder(deletePath);
                                logger.error(`Failed project import - ${err}`, { Date: date });
                                return res.status(400).send({ message: err.message || 'Something went wrong' })
                            });
                    }
                })
            }).catch(function (err) {
                // Deletes the uploaded folder from /projects/extracted folder
                const deletePath = `${path.resolve(location).split(req.user._id)[0]}${req.user._id}`;
                deleteFolder(deletePath);
                logger.error(`Failed project import - ${err}`, { Date: date });
                return res.status(400).send({ message: 'Error while reading config files', err: err })
            });
        });
    });
    unzipper.extract({ path: extractionPath });
}

//Save other details such as eda, training, etc to respective collection
/**
 * 
 * @param {*} newProjectDetails this will have details like projectId about the newly created project.
 * @param {*} allConfigData will have all the details like eda, training etc for the imported project.
 */
function saveEdaData(newProjectDetails, allConfigData) {
    return new Promise(function (resolve, reject) {

        //EDA -- allConfigData[1]
        // Will be an array of edas performed.
        var edaDatas = allConfigData[1];
        edaDatas.map(function (edaData) {
            edaData.projectId = newProjectDetails._id;
            edaData.createdBy = newProjectDetails.createdBy;
            edaData.oldEdaId = edaData._id;
            delete edaData._id;
            delete edaData.createdAt;
            return edaData;
        })
        // Creating new entries for EDA
        Eda.create(edaDatas, function (err, docs) {
            if (err) {
                logger.error("Could not save eda datas " + ' error: ' + err, { Date: date });
                reject({ message: "Could not save eda datas", err: err })
            }
            // Update new edaIds to training data
            allConfigData[2].map(function (trainingData) {
                //docs - new eda data.
                //Find the eda for the training
                var itemFound = docs.find(function (doc) {
                    return doc.oldEdaId == trainingData.edaId
                });
                //Updating new projectId in training data.
                trainingData.projectId = newProjectDetails._id;
                //Updating the createdBy id
                trainingData.createdBy = newProjectDetails.createdBy;
                //Updating new edaId to the respective training data
                trainingData.edaId = itemFound ? itemFound._id : trainingData.edaId;
            })

            //Update new edaIds to files data
            allConfigData[9].map(function (filesData) {
                if (docs) {
                    //docs - new eda data.
                    //Find the eda for the files
                    var itemFound = docs.find(function (doc) {
                        return doc.oldEdaId == filesData.currentEdaId
                    });
                    //Updating new edaId to the respective training data
                    filesData.currentEdaId = itemFound ? itemFound._id : filesData.currentEdaId;
                }
                //Updating new projectId in files data.
                filesData.projectId = newProjectDetails._id;
                //Updating the createdBy id
                filesData.createdBy = newProjectDetails.createdBy;

            })
            //Update new edaIds to datadrift reports
            allConfigData[10].map(function (driftReports) {
                if (docs) {
                    //docs - new eda data.
                    //Find the eda for the data drift
                    var itemFound = docs.find(function (doc) {
                        return doc.oldEdaId == driftReports.edaId
                    });
                    //Updating new edaId to the respective training data
                    driftReports.edaId = itemFound ? itemFound._id : driftReports.edaId;
                }
                //Updating new projectId in data drift report data.
                driftReports.projectId = newProjectDetails._id;
                //Updating the createdBy id
                driftReports.createdBy = newProjectDetails.createdBy;
            })

            allConfigData[8].map(function (model) {
                if (docs) {
                    //docs - new eda data.
                    //Find the eda for the data drift
                    var itemFound = docs.find(function (doc) {
                        return doc.oldEdaId == model.edaId
                    });
                    //Updating new edaId to the respective training data
                    model.edaId = itemFound ? itemFound._id : model.edaId;
                }
                //Updating new projectId in data drift report data.
                model.projectId = newProjectDetails._id;
                //Updating the createdBy id
                model.createdBy = newProjectDetails.createdBy;
            });
            if (allConfigData[19]) {
                allConfigData[19].map(function (tsgroup) {
                    if (docs) {
                        var itemFound = docs.find(function (doc) {
                            return doc.oldEdaId.equals(tsgroup.edaId);
                        });
                        tsgroup.edaId = itemFound ? itemFound._id : tsgroup.edaId;
                    }
                    tsgroup.projectId = newProjectDetails._id;
                    tsgroup.createdBy = newProjectDetails.createdBy;
                    return tsgroup;
                })

            }
            //Updating new EDA data to allConfigData
            allConfigData[1] = docs;
            resolve(allConfigData)
        });
    })
}
function saveModelsData(allConfigData) {
    return new Promise(function (resolve, reject) {
        //New project details
        var newProjectDetails = allConfigData[0];
        //Get the trained models meta data
        var modelDatas = allConfigData[8];
        modelDatas.map(function (modelData) {
            // modelData.projectId = newProjectDetails._id;
            modelData.createdBy = newProjectDetails.createdBy;
            modelData.oldModelId = modelData._id;
            delete modelData._id;
            delete modelData.createdAt;
            return modelData;
        });
        try {
            Models.create(modelDatas, function (err, docs) {
                if (err) {
                    logger.error("Could not update model meta datas" + err, { Date: date });
                    reject({ message: 'Could not update model meta datas!', err: err });
                }
                //Update new training ids to datadrift reports
                allConfigData[10].map(function (driftReports) {
                    if (docs) {
                        var itemFound = docs.find(function (doc) {
                            return doc.oldModelId == driftReports.modelId;
                        });
                        //Updating new trainingId to the respective drift report data
                        driftReports.modelId = itemFound ? itemFound._id : driftReports.modelId;
                    }
                    return driftReports;
                })
                if (allConfigData[19]) {
                    allConfigData[19].map(function (tsgroup) {
                        if (docs) {
                            var itemFound = docs.find(function (doc) {
                                return doc.oldModelId.equals(tsgroup.modelId)
                            });
                            tsgroup.modelId = itemFound ? itemFound._id : tsgroup.modelId;
                        }
                        tsgroup.projectId = newProjectDetails._id;
                        tsgroup.createdBy = newProjectDetails.createdBy;
                        return tsgroup;
                    })
                }
                resolve(allConfigData);
            })
        } catch (error) {
            reject({ message: 'Could not update model meta datas!', err: error });
        }

    })
}
function saveDataDrift(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newProjectDetails = allConfigData[0];
        var driftReports = allConfigData[10];
        var result = driftReports.map(function (driftReport) {
            driftReport.oldDriftReportId = driftReport._id;
            driftReport.projectId = newProjectDetails._id;
            driftReport.createdBy = newProjectDetails.createdBy;
            delete driftReport._id;
            delete driftReport.createdAt;
            return driftReport;
        });
        DataDrift.create(result, function (err, docs) {
            if (err) {
                reject({ message: 'Could not update data drift reports!', err: err });
            } else {
                resolve(allConfigData);
            }
        })

    });
}

//function to save experiments data
let saveExperimentsData = (allConfigData) => {
    return new Promise(function (resolve, reject) {
        let newProjectDetails = allConfigData[0];
        let experimentsData = allConfigData[18];
        if (experimentsData && experimentsData.length) {
            let filesData = allConfigData[9].parentDocs;
            //filter out the files having taExperimentId
            let filesWithTaExperimentId = filesData.filter(file => (file.projectId == newProjectDetails._id && file.fileSource == 'textAnalysis'));
            experimentsData.forEach(experiment => {
                experiment.projectId = newProjectDetails._id;
                experiment.createdBy = newProjectDetails.createdBy;
                experiment.oldExperimentId = experiment._id;
                delete experiment._id;
                delete experiment.createdAt;
                Experiments.create(experiment, function (err, docs) {
                    if (err) {
                        reject({ message: 'Could not update taExperiments Data!', err: err });
                    }
                    //setting taExperimentId to the file
                    if (filesWithTaExperimentId.length) {
                        filesWithTaExperimentId.forEach(file => {
                            if (String(file.taExperimentId) == String(docs.oldExperimentId)) {
                                file.taExperimentId = docs._id;
                                Files.findOneAndUpdate({ _id: file._id }, file, {
                                    returnOriginal: false
                                }, (err, res) => {
                                    if (err) {
                                        reject({ message: 'Could not update taExperimentId!', err: err });
                                    }
                                });
                            }
                        });
                    }
                    resolve(allConfigData);
                });
            });
        } else {
            resolve(allConfigData);
        }
    });
}

let saveTimeseriesGroupData = (allConfigData) => {
    return new Promise(function (resolve, reject) {
        let newProjectDetails = allConfigData[0];
        let tsGroupData = allConfigData[19];
        if (tsGroupData && tsGroupData.length) {
            //filter out the files having taExperimentId
            var result = tsGroupData.map(function (tsGroupData) {
                tsGroupData.projectId = newProjectDetails._id;
                tsGroupData.createdBy = newProjectDetails.createdBy;
                delete tsGroupData._id;
                delete tsGroupData.createdAt;
                return tsGroupData;
            });
            timseriesGroup.create(result, function (err, docs) {
                if (err) {
                    reject({ message: 'Could not create timeseries group!', err: err });
                } else {
                    resolve(allConfigData);
                }
            })
        } else {
            resolve(allConfigData);
        }
    });
}

//save drift configs
function saveDriftConfig(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newProjectDetails = allConfigData[0];
        var driftConfigs = allConfigData[16];
        var result = driftConfigs.map(function (driftConfig) {
            driftConfig.oldDriftConfigId = driftConfig._id;
            driftConfig.projectId = newProjectDetails._id;
            driftConfig.createdBy = newProjectDetails.createdBy;
            delete driftConfig._id;
            delete driftConfig.createdAt;
            return driftConfig;
        });
        DriftConfig.create(result, function (err, docs) {
            if (err) {
                reject({ message: 'Could not update data drift reports!', err: err });
            } else {
                resolve(allConfigData);
            }
        })

    });
}

/**
 * Updates the notebook data after importing
 * @param {*} allConfigData updated data
 */
function saveNotebookData(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newprojectDetails = allConfigData[0];
        var notebookData = allConfigData[17];
        Files.find({ projectId: newprojectDetails._id }, function (err, data) {
            var file = data;
            if (allConfigData[17]) {
                notebookData.map(function (item) {
                    var itemFound = file.find(function (data) {
                        return item.notebookInputFileId == data.oldFileId;
                    })
                    item.notebookInputFileId = itemFound ? itemFound._id : item.notebookInputFileId;
                    item.projectId = newprojectDetails._id;
                    delete item._id;
                    return item;
                })
            }

            Notebook.create(notebookData, function (err, docs) {
                if (err) {
                    logger.error("Could not create notebook" + ' error: ' + err, { Date: date });
                    reject({
                        message: "Could not create notebook",
                        err: err,
                    });
                } else {
                    logger.info("New notebook created", { Date: date });
                    resolve(allConfigData);

                }
            });
        });
    });
}

//Save the files data
function saveFilesData(allConfigData) {
    return new Promise(function (resolve, reject) {
        //New project details
        var newProjectDetails = allConfigData[0];
        //Get the files data
        var filesDatas = allConfigData[9];

        var parentFiles = filesDatas.filter(function (file) {
            return file["parentFileId"] == undefined;
        });
        var result = parentFiles.map(function (parentF) {
            parentF.oldFileId = parentF._id;
            delete parentF._id;
            delete parentF.createdAt;
            return parentF;
        });
        createFileEntry(parentFiles)
            .then(
                function success(parentFilesDocs) {
                    return new Promise(function (resolve, reject) {
                        var newChildData = filesDatas
                            .filter(function (fileData, index) {
                                return fileData["parentFileId"] ? true : false;
                            })
                            .map(function (childData) {
                                delete childData._id;
                                // childData.parentFileId = parentFileDoc[0]._id;
                                var itemFound = parentFilesDocs.find(function (doc) {
                                    return doc.oldFileId == childData.parentFileId;
                                });
                                //Updating new parentFileId to the respective child file
                                childData.parentFileId = itemFound
                                    ? itemFound._id
                                    : childData.parentFileId;
                                return childData;
                            });
                        allConfigData[10].map(function (item) {
                            var itemFound = parentFilesDocs.find(function (doc) {
                                return doc.oldFileId == item.incomingFileId;
                            })
                            item.incomingFileId = itemFound ? itemFound._id : item.incomingFileId;
                        })
                        parentFilesDocs.map(function (data) {
                            var itemFound = parentFilesDocs.find(function (doc) {
                                return doc.oldFileId.equals(data.notebookInputFileId);
                            })
                            data.notebookInputFileId = itemFound ? itemFound._id : data.notebookInputFileId;
                        })
                        updateFiles(parentFilesDocs);
                        if (allConfigData[1] !== undefined) {
                            allConfigData[1].map(function (data) {
                                var itemFound = parentFilesDocs.find(function (doc) {
                                    return data.fileId.equals(doc.oldFileId);
                                })
                                data.fileId = itemFound ? itemFound._id : data.fileId;
                            })
                            updateEdaCollection(allConfigData[1]);
                        }
                        // setting new file id to the experiments
                        if (allConfigData[18] && allConfigData[18].length) {
                            let experimentsData = allConfigData[18];
                            parentFilesDocs.forEach(file => {
                                experimentsData.forEach(experiment => {
                                    if (file.oldFileId == experiment.fileId) {
                                        experiment.fileId = file._id;
                                    }
                                });
                            });
                        }

                        resolve({ childDocs: newChildData, parentDocs: parentFilesDocs })
                    },
                        function error(err) {
                            logger.error('Could not save files data' + ' error: ' + err, { Date: date });
                            reject({ message: "Could not save files data!", err: err });
                        }
                    )
                        .then(
                            function (allDocs) {
                                createFileEntry(allDocs["childDocs"]).then(
                                    function success(childDocs) {
                                        allConfigData[9] = { parentDocs: allDocs["parentDocs"] };
                                        allConfigData[21] = { childDocs: childDocs };
                                        resolve(allConfigData);
                                    },
                                    function error(err) {
                                        logger.error('Could not save child files datas' + ' error: ' + err, { Date: date });
                                        reject({ message: "Could not save child files data!", err: err });
                                    }
                                );
                            },
                            function (err) {
                                logger.error('Could not save child files data' + ' error: ' + err, { Date: date });
                                reject({ message: "Could not save child files data!", err: err });
                            }
                        );
                });
    });
}

function updateEdaCollection(data) {
    return new Promise(function (resolve, reject) {
        var edaData;
        for (var i = 0; i < data.length; i++) {
            update = data[i].fileId;
            edaId = data[i]._id;
            if (data[i].fileId) {
                Eda.updateOne({ _id: edaId }, { "$set": { fileId: update } }).then(function (data) {
                    edaData = data;
                }, function (err) {
                    logger.error("Could not update eda" + ' error: ' + err, { Date: date });
                    reject({ message: "Could not update eda", error: err })
                });
            }
        }
        resolve(edaData);
    });
}
function updateFiles(data) {
    return new Promise(function (resolve, reject) {
        var filesData;
        for (var i = 0; i < data.length; i++) {
            update = data[i].notebookInputFileId;
            filesId = data[i]._id;
            if (data[i].notebookInputFileId) {
                Files.updateOne({ _id: filesId }, { "$set": { notebookInputFileId: update } }).then(function (data) {
                    filesData = data;
                }, function (err) {
                    logger.error("Could not update files" + ' error: ' + err, { Date: date });
                    reject({ message: "Could not update files", error: err })
                });
            }
        }
        resolve(filesData);
    });
}

function saveDataGroup(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newprojectDetails = allConfigData[0];
        var dataGroup = allConfigData[12];
        dataGroup.splice(0, 1);

        var dataId;
        DataGroup.find({ projectId: newprojectDetails._id, name: '/' }, function (err, data) {
            // This dataId is the new root data group id
            dataId = data[0]._id;
            // This logic is used only when there are other data groups except root
            dataGroup.map(function (dataGroup) {
                dataGroup.projectId = newprojectDetails._id;
                dataGroup.oldDataGroupId = dataGroup._id;
                dataGroup.oldParentId = dataGroup.parentId;
                dataGroup.parentId = dataId;
                delete dataGroup._id;
                delete dataGroup.createdAt;
                return dataGroup;
            });
            DataGroup.create(dataGroup, function (err, docs) {
                var dataGroupIds = [];
                if (err) {
                    logger.error('Could not save dataGroup!' + ' error: ' + err, { Date: date });
                    reject({ message: 'Could not save dataGroup!', err: err })
                }
                if (docs) {
                    docs.map(function (datagroup) {
                        var itemFound = docs.find(function (doc) {
                            return datagroup.oldParentId.equals(doc.oldDataGroupId);
                        });
                        datagroup.parentId = itemFound ? itemFound._id : dataId;
                    });
                    dataGroupUpdate(docs, dataId);
                }

                allConfigData[11].map(function (dataconnection) {
                    if (docs) {
                        var itemFound = docs.find(function (doc) {
                            return doc.oldDataGroupId == dataconnection.dataGroupId
                        });
                    }
                    dataconnection.projectId = newprojectDetails._id;
                    dataconnection.createdBy = newprojectDetails.createdBy;
                    dataconnection.dataGroupId = itemFound ? itemFound._id : dataId;
                })

                allConfigData[13].map(function (rawfile) {
                    if (docs) {
                        var itemFound = docs.find(function (doc) {
                            return doc.oldDataGroupId == rawfile.dataGroupId
                        });
                    }
                    rawfile.projectId = newprojectDetails._id;
                    rawfile.createdBy = newprojectDetails.createdBy;
                    rawfile.dataGroupId = itemFound ? itemFound._id : dataId;
                })

                allConfigData[9].map(function (file) {
                    if (docs) {
                        var itemFound = docs.find(function (doc) {
                            return doc.oldDataGroupId == file.dataGroupId
                        });
                    }
                    file.projectId = newprojectDetails._id;
                    file.createdBy = newprojectDetails.createdBy;
                    file.dataGroupId = itemFound ? itemFound._id : dataId;
                });

                if (allConfigData[15]) {
                    allConfigData[15].map(function (item) {
                        if (docs) {
                            var itemFound = docs.find(function (data) {
                                return data.oldDataGroupId == item.dataGroupId;
                            })
                        }
                        if (item.dataGroupId) {
                            item.dataGroupId = itemFound ? itemFound._id : dataId;
                        }
                    })
                }
                if (allConfigData[17]) {
                    allConfigData[17].map(function (notebook) {
                        var itemFound, dataGroups;
                        if (docs) {
                            itemFound = docs.find(function (doc) {
                                return doc.oldDataGroupId == notebook.outputFileDataGroupId;
                            });
                        }
                        if (itemFound) {
                            dataGroups = {
                                oldDataGroupId: itemFound.oldDataGroupId,
                                newDataGroupId: itemFound._id,
                            };
                            dataGroupIds.push(dataGroups);
                            notebook.outputFileDataGroupId = itemFound._id;
                        } else {
                            dataGroups = {
                                oldDataGroupId: notebook.outputFileDataGroupId,
                                newDataGroupId: dataId,
                            }
                            dataGroupIds.push(dataGroups);
                            notebook.outputFileDataGroupId = dataId;
                        }
                        notebook.projectId = newprojectDetails._id;
                    });
                }

                var data = {
                    projectId: newprojectDetails._id,
                    createdBy: newprojectDetails.createdBy,
                    dataGroupIds: dataGroupIds,
                };
                var options = {
                    uri: ps_core_server_url + "/api/notebook/update_ids",
                    method: "POST",
                    json: data,
                };
                request(options, function (error, response, body) {
                    if (response.statusCode !== 200) {
                        logger.error("Could not updated notebook data" + ' error: ' + response.body.message, { Date: date });
                    } else {
                        logger.info("Updated notebook data" + ' response: ' + response.body, { Date: date });
                    }
                });
                resolve(allConfigData)
            })
        });
    });
}

function dataGroupUpdate(data, dataId) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < data.length; i++) {
            var dataGroup
            update = data[i].parentId;
            dataGroupId = data[i]._id;
            if (dataGroupId != dataId) {
                DataGroup.updateOne({ _id: dataGroupId }, { "$set": { parentId: update } }).then(function (data) {
                    dataGroup = data;
                }, function (err) {
                    logger.error("Could not update datagroup" + ' error: ' + err, { Date: date });
                    reject({ message: "Could not update datagroup", error: err })
                });
            }

        }
        resolve(dataGroup);
    });
}
function saveDataConnection(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newprojectDetails = allConfigData[0];
        var dataconnection = allConfigData[11];
        dataconnection.map(function (dataconnection) {
            dataconnection.projectId = newprojectDetails._id;
            dataconnection.oldDataConnectionId = dataconnection._id;
            delete dataconnection._id;
            delete dataconnection.createdAt;
            return dataconnection;
        });
        Dataconnection.create(dataconnection, function (err, docs) {
            if (err) {
                logger.error('Could not save data connection!' + ' error: ' + err, { Date: date });
                reject({ message: 'Could not save data connection!', err: err })
            }
            // if (allConfigData[13].hasOwnProperty('dataConnId')) {
            allConfigData[13].map(function (rawfile) {
                if (rawfile.dataConnId) {
                    var itemFound = docs.find(function (doc) {
                        return doc.oldDataConnectionId == rawfile.dataConnId;
                    });
                }
                //Updating new projectId in training data.
                rawfile.projectId = newprojectDetails._id;
                //Updating the createdBy id
                rawfile.createdBy = newprojectDetails.createdBy;
                //Updating new dataconnaId to the respective training data
                rawfile.dataConnId = itemFound ? itemFound._id : rawfile.dataConnId;
            })
            // }
            resolve(allConfigData)
        });
    });
}

function saveRawFiles(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newprojectDetails = allConfigData[0];
        var rawfile = allConfigData[13];
        rawfile.map(function (rawfile) {
            rawfile.projectId = newprojectDetails._id;
            delete rawfile._id;
            delete rawfile.createdAt;
            return rawfile;
        });
        Rawfiles.create(rawfile, function (err, docs) {
            if (err) {
                logger.error('Could not save report!' + ' error: ' + err, { Date: date });
                reject({ message: 'Could not save report!', err: err })
            }
            resolve(allConfigData)
        })

    });
}
function saveOutput(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newprojectDetails = allConfigData[0];
        var output = allConfigData[14];
        output.map(function (output) {
            output.projectId = newprojectDetails._id;
            delete output._id;
            delete output.createdAt;
            return output;
        });
        Output.create(output, function (err, docs) {
            if (err) {
                logger.error('Could not save report!' + ' error: ' + err, { Date: date });
                reject({ message: 'Could not save report!', err: err })
            }
            resolve(allConfigData)
        })
    });
}
function saveUddFlow(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newprojectDetails = allConfigData[0];
        var uddflow = allConfigData[15];
        var date = new Date();
        var timestamp = date.getTime();
        if (uddflow.length) {
            //checking if psflow.json is present or not
            if (!fs.existsSync('./node-red/flows/psflow.json')) {
                fs.writeFileSync("./node-red/flows/psflow.json", "[]", "utf8");
            }
            // Updates the psflow.json file with all the flows which are present in imported project
            fs.readFile(
                "./node-red/flows/psflow.json",
                "utf8",
                function (err, psFlowData) {
                    if (err) throw err;
                    else {
                        var newFlowsArray = [];
                        var oldFlow = JSON.parse(psFlowData);
                        var matchFound = false

                        // merging the old flows array with new one, without duplicates
                        allConfigData[3].forEach((newFlowItem) => {
                            matchFound = false;
                            oldFlow.forEach((oldFlowItem) => {
                                if (JSON.stringify(newFlowItem) == JSON.stringify(oldFlowItem)) {
                                    matchFound = true;
                                }
                            });
                            if (!matchFound) {
                                newFlowsArray.push(newFlowItem);
                            }
                        });
                        var mergeFlows = [...new Set([...oldFlow, ...newFlowsArray])];
                        var finalFlows = JSON.stringify(mergeFlows);

                        fs.writeFile(
                            "./node-red/flows/psflow.json",
                            finalFlows,
                            function (err) {
                                if (err) throw err;
                                //refresh the nodered flows(after appending the flows,it was not loading on nodered UI when we edit it.)
                                config.RED.runtime.flows.setFlows({
                                    user: null,
                                    deploymentType: "reload",
                                }).then(function (flow) {
                                });
                            }
                        );
                    }
                }
            );
            uddflow.map(function (uddflow) {
                uddflow.projectId = newprojectDetails._id;
                uddflow.createdBy = newprojectDetails.createdBy;
                uddflow.flowName = uddflow.flowName + "_" + timestamp;
                uddflow.oldFlowId = uddflow._id;
                delete uddflow._id;
                delete uddflow.createdAt;
                return uddflow;
            });
            // Creates a new entry in the udd flow with updated values    
            UddFlow.create(uddflow, function (err, docs) {
                if (err) {
                    logger.error("Could not save data flow!" + ' error: ' + err, { Date: date });
                    reject({ message: "Could not save data flow!", err: err });
                }

                allConfigData[11].map(function (connectionData) {
                    // docs - new udd data
                    var itemFound = docs.find(function (item) {
                        return item.oldFlowId == connectionData.dataflowId;
                    });

                    // Updates the connection data with the new dataflowId
                    if (itemFound) {
                        connectionData.dataflowId = itemFound._id;
                        Dataconnection.updateOne(
                            { dataflowId: itemFound.oldFlowId },
                            {
                                $set: {
                                    dataflowId: itemFound._id,
                                },
                            }
                        ).then(
                            function (data) {
                                logger.info("dataFlowId updated in data connection", { Date: date });
                            },
                            function (err) {
                                logger.error(
                                    "Could not update dataFlowId in data connection" + ' error: ' + err, { Date: date });
                            }
                        );
                    }
                });
            });
        }
        resolve(allConfigData);
    });
}
//function to create the file entry
function createFileEntry(filesDatas) {
    try {
        return Files.create(filesDatas);
    } catch (err) {
        console.log(err)
    }
}
//Save the training data to DB
function saveTrainingData(allConfigData) {
    return new Promise(function (resolve, reject) {
        //New project details
        var newProjectDetails = allConfigData[0];
        //Get the training data
        var trainingDatas = allConfigData[2];
        //Get the parent docs info
        parntFileDetails = allConfigData[9]['parentDocs'];
        childDetails = allConfigData[21]['childDocs'];
        //Update the training document with new file id
        trainingDatas.map(function (trainingData) {
            trainingData.oldTrainingId = trainingData._id;
            delete trainingData._id;
            if (trainingData['originalFileId']) {
                parntFileDetails.find(function (parentFile) {
                    if (parentFile.oldFileId == trainingData.originalFileId) {
                        trainingData.originalFileId = parentFile._id;
                        return true;
                    }
                });
            }
            return trainingData;
        });
        trainingDatas.map(function (trainData) {
            if (childDetails) {
                let item = childDetails.find(function (child) {
                    return trainData.originalFileId == child.parentFileId;
                });
                trainData.afterEdaFileId = item ? item._id : trainData.afterEdaFileId;
            }

        })
        Trainings.create(trainingDatas, function (err, docs) {
            if (err) {
                reject({ message: 'Could not save training data!', err: err })
            }
            allConfigData[10].map(function (driftReports) {
                if (docs) {
                    var itemFound = docs.find(function (doc) {
                        return doc.oldTrainingId == driftReports.trainingId;
                    });
                    //Updating new trainingId to the respective drift report data
                    driftReports.trainingId = itemFound ? itemFound._id : driftReports.trainingId;
                }
                return driftReports;
            })
            if (docs && docs.length) {
                docs.forEach(function (trainingData) {
                    //models data
                    allConfigData[8].map(function (model) {
                        //docs - new training data.
                        //update the trainingId in matched model data
                        if (model.trainingId == trainingData.oldTrainingId) {
                            model.trainingId = trainingData._id;
                            model.projectId = trainingData.projectId;
                        }
                        return model;
                    });
                    resolve(allConfigData)
                })
            } else {
                //Update training data in allConfigData
                allConfigData[2] = docs;
                resolve(allConfigData)
            }

        })
    });
}
//Move ectracted projects folder contents to new project folder
function moveProjectFiles(newProjectDetails, importedProjectId, fromLocation, importedProjectName) {
    return new Promise(function (resolve, reject) {
        var oldPath, newPath = null;
        if (os.platform().toString().indexOf('win32') !== -1) {
            //windows
            newPath = config.projectDir + '\\' + newProjectDetails._id;
            oldPath = fromLocation + '\\' + importedProjectId;
        } else {
            //linux
            newPath = config.projectDir + '/' + newProjectDetails._id;
            oldPath = fromLocation + '/' + importedProjectId;
        }
        //Copy the project files from the extracted folder to new project folder
        fsx.copy(path.resolve(oldPath), path.resolve(newPath), function (err) {
            const deletePath = `${path.resolve(fromLocation).split(newProjectDetails.createdBy)[0]}${newProjectDetails.createdBy}`;
            if (err) {
                logger.error('Could not copy project files' + ' error: ' + err, { Date: date });
                // After err, remove old folder
                deleteFolder(deletePath);
                reject({ message: 'Could not copy project files!', err: err });
            }
            // After copy, remove old folder
            deleteFolder(deletePath);
            resolve(newProjectDetails);
        });
    });
}

/**
 * Deletes the folder from the provided path
 */
function deleteFolder(fromLocation) {
    fsx.remove(path.resolve(fromLocation), function (err) {
        if (err) {
            logger.error('Could not remove folder from extracted.' + ' error: ' + err, { Date: date });
        }
    });
}

//Save auditLogData
function saveAuditLogData(allConfigData) {
    return new Promise(function (resolve, reject) {
        //New project details
        var newProjectDetails = allConfigData[0];
        //Get the auditlog data
        var auditLogs = allConfigData[4];
        auditLogs.map(function (auditLog) {
            auditLog.projectId = newProjectDetails._id;
            auditLog.userId = newProjectDetails.createdBy;
            delete auditLog._id;
            delete auditLog.createdAt;
            return auditLog;
        });
        AuditLog.create(auditLogs, function (err, docs) {
            if (err) {
                logger.error('Could not save auditlog datas!' + ' error: ' + err, { Date: date });
                reject({ message: 'Could not save auditlog datas!', err: err })
            }
            resolve(allConfigData)
        })
    })
}
//Save UDD data
function saveEdaProgressData(allConfigData) {
    return new Promise(function (resolve, reject) {
        var newProjectDetails = allConfigData[0];
        //Get the trained models meta data
        var edaProgressDatas = allConfigData[5];
        edaProgressDatas.map(function (edaProgressData) {
            edaProgressData.projectId = newProjectDetails._id;
            delete edaProgressData._id;
            delete edaProgressData.createdAt;
            return edaProgressData;
        });
        EdaProgress.create(edaProgressDatas, function (err, docs) {
            if (err) {
                logger.error('Could not save edaProgress datas!' + ' error: ' + err, { Date: date });
                reject({ message: 'Could not save edaProgress datas!', err: err })
            }
            resolve(allConfigData)
        })
    })
}
//promisify fs.readFile()
fs.readFileAsync = function (file, userId) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.resolve(file), 'utf8', function (err, buffer) {
            if (err) {
                logger.error('Error occurred' + ' error: ' + err, { Date: date });
                const deletePath = `${path.resolve(file).split(userId)[0]}${userId}`;
                deleteFolder(deletePath);
                reject(err);
            } else {
                resolve(JSON.parse(buffer));
            }
        })
    })
}
//Read the config files
function readConfigFiles(file, userId) {
    return fs.readFileAsync(file, userId);
}


/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.projectById = function (req, res, next, id) {
    ProjectConfig.findById(id).exec(function (err, project) {
        if (err) {
            logger.error("Error while finding project configuration" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!project) {
            return res.status(404).send({ message: "No project Configuration with that identifier has been found" });
        }
        req.project = project;
        next();
    })
};
/**
 * Find a message by Id
 */
exports.messageById = function (req, res, next, id) {
    ProjectDiscussion.findById(id).exec(function (err, message) {
        if (err) {
            logger.error("Error while message details!" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!message) {
            return res.status(404).send({ message: "No messages has been found!" });
        }
        req.message = message;
        next();
    })
}
exports.findById = findById;
function findById(id, callback) {
    ProjectConfig.findById(id).exec(function (err, project) {
        if (err) {
            logger.error("Error while finding Project configuration" + ' error: ' + err, { Date: date });
            return callback(null);
        }
        else if (!project) {
            return callback(null);
        }
        callback(project);
    })
}

exports.getProjectCount = function (req, res) {
    let userQuery;
    let query;
    let userPlanType;
    if (!req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
        userQuery = { subscription: req.subscription._id }
    } else {
        userQuery = {}
    }
    User.find(userQuery).exec(function (err, user) {
        let userList = [];
        user.forEach(function (item) {
            userList.push(item._id);

        });
        if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
            userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
            query = {
                createdBy: {
                    $in: userList
                },
                isDeleted: false
            }
        } else {
            query = {}
        }
        ProjectConfig.find(query).exec(function (err, count) {
            if (err) {
                logger.error("Unable to get count of projects" + ' error: ' + err, { Date: date });
                return res.send({ message: 'Unable to get count of projects' });
            } else {
                count = count.length;
                //the request is from ps-lite
                if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin')) {
                    let projectLimit = null;
                    let data = null;
                    let feedbackProjectReward = null;
                    Plans.findOne({ planType: userPlanType }, function (err, planTemplateData) {
                        if (err) {
                            logger.error('Can not add new Plan to the plans collection', { Date: date })
                            return res.status(400).send(err.message);
                        }
                        data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'project');
                        data.rules.find(item => {
                            if (item.name === 'projectCount') {
                                projectLimit = item.allowedValues;
                            }
                        });
                        feedbackModuleData = planTemplateData.restrictionPlans.find(val => val.moduleName === 'feedback');
                        feedbackModuleData.rules.find(item => {
                            if (item.name === 'numberofprojectsforreward') {
                                feedbackProjectReward = item.allowedValues;
                            }
                        });
                        if (req.subscription?.planDuration === 'yearly') {
                            projectLimit = (Number(projectLimit) * 12) + 5;
                        }
                        // check if the user has submitted the survey and reward the extra projects.
                        FeedbackSurvey.countDocuments({ subscriptionId: req?.subscription?._id, surveyType: 'rewardSurvey' }).exec(function (error, surveyCount) {
                            if (err) {
                                logger.error("Unable to get count of survey" + ' error: ' + err, { Date: date });
                                return resolve(false);
                            } else if (surveyCount) {
                                projectLimit = Number(projectLimit) + Number(feedbackProjectReward);
                                return res.send({ projectLimit, count })
                            } else {
                                return res.send({ projectLimit, count })
                            }
                        });
                    });
                } else {
                    return res.send({ count })
                }
            }
        });
    })

}

// exports.getAllProjectDetails = function (req, res) {
//     let obj = {};
//     var edaData = Eda.find({ projectId: req.project._id });
//     //Training data for the project
//     var modelsData = Models.find({ projectId: req.project._id });
//     //Get drift reports
//     var driftReports = DataDrift.find({ projectId: req.project._id });
//     //output for projects
//     //  var output = Output.find({ projectId: params.projectId }).exec();
//     var driftConfigs = DriftConfig.find({ projectId: req.project._id });
//     // Get taExperiments data
//     var taexperiments = Experiments.find({ projectId: req.project._id });
//     Promise.all([edaData, modelsData, driftReports, driftConfigs, taexperiments]).then(function (values) {
//         Object.assign(obj, { edaData: values[0], modelsData: values[1], driftReports: values[2], driftConfigs: values[3], taexperiments: values[4] });
//         res.send([obj]);
//     }).catch(function (err) {
//         logger.error('Error while reading files info!' + 'userId:' + req.user._id + err, { Date: date });
//     });
// }