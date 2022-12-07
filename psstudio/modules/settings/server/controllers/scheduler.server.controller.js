/**
 * Created by winjitian on 06/01/2020.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
    Scheduler = mongoose.model('Scheduler'),
    request = require('request'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller');
var schedulerUtil = require('../../../../utils/system/scheduler.system.utils');
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var _ = require('lodash');
var date = Date(Date.now());
date = date.toString();

/**
 * Create a new Database connection configuration
 */
exports.create = function (req, res) {
    var data = req.body;
    data.createdBy = req.user._id;
    var scheduler = new Scheduler(data);
    scheduler.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save Scheduler' + ' error: ' + err, { Date: date });
            res.status(400).send({ statusText: 'Unable to save Scheduler' });
        }
        else {
            logger.info('Scheduler created', { Date: date });
            //Create cron job
            var data = {
                jobId: doc._id,
                rule: doc.rule,
                scheduleStartTime: doc.scheduleStartTime
            }
            schedulerUtil.createJob(data, function (err, job) {
                if (err) {
                    logger.error(err, { Date: date });
                    return res.status(400).send(err)
                }
                res.send(doc)

            })
            // res.send(doc);
        }
    });
}
/**
 * List all schedulers
 */
exports.list = function (req, res) {
    getScheduler().then(function (docs) {
        res.send(docs);
    }, function (err) {
        logger.error('Could not fetch scheduler details', { Date: date })
        res.status(400).send({ message: 'Could not fetch Scheduler details!', err: err });
    });
}

function getScheduler() {
    return Scheduler.find({});
}
function getAllSchedulers() {
    return Scheduler.find({ isStopped: false });
}
module.exports.findAllSchedulers = getAllSchedulers
/**
 * Function to test the connection settings
 */
// exports.testConnection = function (req, res) {
//     var data = req.body;
//     var options = {
//         uri: ps_core_server_url + '/api/dbconn/test_connection',
//         method: 'POST',
//         json: data
//     };
//     request(options, function (error, response, body) {
//         // If everthing ges well response will come in html format, you can bind this html in angularjs
//         if (!error && response.statusCode == 200) {
//             res.send(body);
//         } else {
//             res.status(400).send(body);
//         }
//     });
// }
/**
 * Find one record by id
 */
exports.findOne = function (req, res) {
    var data = req.scheduler;
    res.send(data);
}
/**
 * Update a particular dbConn
 */
exports.update = function (req, res) {
    var data = req.body;
    var schedulerId = data._id;
    // delete req.body._id;
    var scheduler = _.extend(req.scheduler, req.body);
    scheduler.save(function (err, doc) {
        if (err) {
            logger.error("Could not Update Scheduler" + 'error: ' + err, { Date: date });
            if (res) {
                res.status(400).send({ message: "Could not Update Scheduler" });
            }
        } else {
            //reschedule the cron job when scheduler settings is changed
            var jobData = {
                jobId: schedulerId,
                rule: data.rule,
                scheduleStartTime: data.scheduleStartTime
            }
            if (doc.isStopped == 'false') {
                schedulerUtil.reScheduleJob(jobData, function (err, data) {
                    if (err) {
                        logger.error("Could not reschdule the job", { Date: date });
                        return res.status(400).send({ message: "Could not reschdule the job" });
                    }

                })
            }
            logger.info("Scheduler Update", { Date: date });
            res.send({ message: 'Update Scheduler.' });

        }
    });
}
/**
 * Delete a scheduler
 */
exports.deleted = function (req, res) {
    Scheduler.deleteOne({ _id: req.scheduler._id }, function (err) {
        if (err) {
            logger.error("Could not delete Scheduler" + ' error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not delete Scheduler" });
        } else {
            logger.info("Scheduler deleted" + 'schedulerid:' + req.scheduler._id, { Date: date });
            var data = {
                jobId: req.scheduler._id,
                isStopped: req.scheduler.isStopped
            }
            schedulerUtil.removeJob(data, function (err, data) {
                if (err) {
                    logger.error("Could not delete job" + ' error: ' + err, { Date: date });
                    return res.status(400).send({ message: "Could not delete Scheduler" });
                } else {
                    logger.info(data, { Date: date });
                    res.send({ message: 'Deleted Scheduler and job' });
                }
            })
        }
    });
}

/**
 * pause a scheduler
 */
module.exports.pause = function (req, res) {
    var data = req.scheduler;
    var queryObj = { _id: req.scheduler._id };
    var setObj = { isStopped: true }
    Scheduler.findOneAndUpdate(queryObj, { "$set": setObj }, function (err) {
        if (err) {
            logger.error("Could not Update Scheduler" + ' error: ' + err, { Date: date });
            if (res) {
                res.status(400).send({ message: "Could not Update Scheduler" });
            }
        }
        schedulerUtil.pauseJob(data, function (err, data) {
            if (err) {
                logger.error("Could not stop job" + ' error: ' + err, { Date: date });
                return res.status(400).send({ message: "Could not stop Scheduler" });
            } else {
                logger.info(data, { Date: date });
                res.send({ message: 'Stopped Scheduler and job' });
            }
        })
    });
}

module.exports.play = function (req, res) {
    var jobData = {
        jobId: req.scheduler._id,
        rule: req.scheduler.rule,
        scheduleStartTime: req.scheduler.scheduleStartTime
    }
    var queryObj = { _id: req.scheduler._id };
    var setObj = { isStopped: false }
    Scheduler.findOneAndUpdate(queryObj, { "$set": setObj }, function (err) {
        if (err) {
            logger.error("Could not Update Scheduler" + ' error: ' + err, { Date: date });
            if (res) {
                res.status(400).send({ message: "Could not Update Scheduler" });
            }
        }
        schedulerUtil.reScheduleJob(jobData, function (err, data) {
            if (err) {
                logger.error("Could not reschdule the job", { Date: date });
                return res.status(400).send({ message: "Could not reschdule the job" });
            }
            logger.info("Restarted Scheduler", { Date: date });
            res.send({ message: 'Restarted Scheduler.' });
        })

    })

}
/**
 * Middleware for finding ps core Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.schedulerById = function (req, res, next, id) {
    Scheduler.findById(id).exec(function (err, scheduler) {
        if (err) {
            logger.error("Error while finding dbconn data" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!scheduler) {
            return res.status(404).send({ message: "No dbconn with that identifier has been found" });
        }
        req.scheduler = scheduler;
        next();
    })
};
// Find a scheduler by its id
exports.findSchedulerById = function (req, res, next) {
    var schedulerId = null;
    if (req.body.hasOwnProperty('scheduleId')) {
        schedulerId = req.body.scheduleId;
        if (schedulerId == 'None') {
            next();
        } else {
            Scheduler.findById(schedulerId).exec(function (err, scheduler) {
                if (err) {
                    logger.error("Error while finding dbconn data" + ' error:' + err, { Date: date });
                    return next(err);
                } else if (!scheduler) {
                    return res.status(404).send({ message: "No Scheduler with that identifier has been found" });
                }
                req.scheduler = scheduler;
                next();
            })
        }
    } else {
        next();
    }

};

//Delete a task from the scheduler

module.exports.deleteTask = function (req, res) {
    Scheduler.findById(req.scheduleId, function (err, doc) {
        if (err) {
            logger.error('Could not find task' + ' error: ' + err, { Date: date })
            return res.status(400).send({ message: 'Could not find task' });
        }
        var task = doc.tasks.filter(function (item) {
            return item.taskId.equals(req.taskId);
        });
        try {
            doc.tasks.id(task[0]._id).remove();
            doc.save(function (err, scheduler) {
                if (err) {
                    logger.error('Could not remove task from scheduler', { Date: date })
                } else {
                    res.send({ message: 'Task removed from scheduler' });
                }
            })
        } catch (error) {
            logger.error('Task array is empty' + ' error: ' + error, { Date: date })
            res.send({ message: 'Task array is empty' });
        }

    })
}