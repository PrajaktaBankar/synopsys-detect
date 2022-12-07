/**
 * Created by winjitian.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller')
multer = require('multer'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    fs = require('fs'),
    config = require("../../../../config/config"),
    glob = require("glob"),
    mongoose = require('mongoose'),
    Ajv = require('ajv'),
    _ = require("lodash");
var socket = require("../../../../utils/socket/core.socket.utils");
var destination = './projects/';
//pscore host details
var pscoreHost = require("../../../../config/env/pscore.config");
var Dir = process.env.DATA_DIR || 'projects';
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var FeatureRepository = mongoose.model('FeatureRepository');
var User = mongoose.model('User');
var SharedFeature = mongoose.model('SharedFeature');
var ajv = new Ajv();
var featureValidation = require('../validation/features.server.validation');
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var date = Date(Date.now());
date = date.toString();
/**
 * List all features created by a user
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    FeatureRepository.find({ createdBy: req.user._id, isDeleted: false, status: 'Success' }).exec(function (err, features) {
        if (err) {
            logger.error('Could not fetch details' + err, { Date: date });
            res.status(400).send({ message: 'Could not fetch details!' })
        }
        res.send(features);
    })

};
// Function to list all the shared features for a user
exports.listSharedFeatures = function (req, res) {
    //Get all the features shared to a particular user
    var sharedFeatures = SharedFeature.findOne({ userId: req.user._id }).populate('sharedFeatures').exec();
    //Get all the features created by the same user
    var myFeatures = FeatureRepository.find({ createdBy: req.user._id }).exec();
    Promise.all([sharedFeatures, myFeatures]).then(function (data) {
        var result = [];
        //Get result from shareFeature and myFeature, concatinate them and return the result
        //This will have both shared fetaure and created feature as well
        if (data[0]) {
            data[0].sharedFeatures = data[0].sharedFeatures.concat(data[1]);
            result = data[0];
        } else {
            result = { sharedFeatures: data[1] };
        }
        res.send(result)
    });
}

/**
 * Function to trigger feature sharing API
 * @param projectId selected project id
 */
exports.create = function (req, res) {
    var data = req.body;
    var valid = featureValidation.validateCreateFeatureSchema(data)
    if (!valid) {
        logger.error('All fields are mandatory');
        return res.status(400).send({ err: featureValidation.validateCreateFeatureSchema.errors, message: "All fields are mandatory!" })
    }
    data.projectId = req.project._id;
    data.encoding = req.project.fileEncoding;
    data.createdBy = req.user._id;
    //afterEdaFilePath
    // data.filePath = path.resolve(req.edaSummary.afterEdaDataFilePath);
    data.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.edaSummary.afterEdaDataFilePath });

    data.sharedFeatures = data.sharedFeaturesList;
    var featureRepoData = new FeatureRepository(data);
    featureRepoData.save(function (err, doc) {
        if (err) {
            logger.error('Could not save info', { error: err, Date: date });
            res.status(400).send({ message: 'Could not save info!', err: err })
        }
        data._id = doc._id;
        var options = {
            uri: ps_core_server_url + '/api/feature_repo/share_features',
            method: 'POST',
            json: data
        };
        //Create a request
        request(options, function (error, response, body) {
            if (error) {
                logger.error('Could not shared features', { error: error, Date: date });

            }
            if (!error && response.statusCode == 200) {
                return res.json(body)
            }
        });
    })
}
//Delete a created feature
exports.delete = function (req, res) {
    var data = req.body;
    FeatureRepository.findOne({ _id: data._id }, function (err, doc) {
        if (err) {
            logger.error('Could not find the feature!', { error: err, Date: date });
            return res.status(400).send({ message: 'Coud not find the feature!' })
        }
        if (doc.isShared) {
            logger.error('Shared feature could not deleted' + 'featureId: ' + data._id);
            return res.status(400).send({ message: 'Shared feature, could not delete!' })
        }
        doc.set({ isDeleted: true });
        doc.save(function (er, feature) {
            if (err) {
                logger.error('Could not update the feature info!', { error: err, Date: date });
                return res.status(400).send({ message: 'Could not update the feature info!' })
            }
            logger.info('feature saved' + feature, { Date: date });
            res.send(feature)
        })
    })
}
// This API is triggerd from python code when the feature sharing/create is completed
exports.done = function (req, res) {
    var data = req.feature;
    var project = {
        _id: data.projectId,
        createdBy: data.createdBy
    }
    if (req.body.shareStatus == 'Failure') {
        data.set({ status: req.body.shareStatus });
        updateFeatureRepo(data, function (err, data) {
            if (err) {
                logger.error('Could not update the feature info!', { error: err, Date: date });
                return res.status(400).send({ message: 'Could not update the feature record in database!' })
            }
            socket.emit("featureSharing", { data: req.body }, project);
            return res.send({ message: 'Notified user' })
        })
    }
    if (req.body.isFileCreated) {
        //source = py, request is from python server there we need to update different keys
        if (req.query.source == 'py') {
            data.set({
                sharedFileName: req.body.sharedFileName,
                isFileCreated: req.body.isFileCreated,
                status: req.body.shareStatus,
                sharedFeaturesList: req.body.sharedFeaturesList,
                sharedIndex: req.body.sharedIndex,
                createdBy: req.body.createdBy,
                projectId: req.body.projectId,
                name: req.body.name
            });
        } else {
            data.set({ sharedFileName: req.body.sharedFileName, isFileCreated: req.body.isFileCreated, status: req.body.shareStatus });
        }
        updateFeatureRepo(data, function (err, data) {
            if (err) {
                logger.error('Could not update the record in database' + err, { Date: date });
                return res.status(400).send({ message: 'Could not update the record in database!' })
            }
            socket.emit("featureSharing", { data: data }, project);
            return res.send({ message: 'Updated database and notified user' })
        })
    } else {
        socket.emit("featureSharing", { data: data }, project);
        res.send({ message: 'Updated database and notified user' })
    }
}

//function to update the feature repository
function updateFeatureRepo(doc, callback) {
    doc.save(function (err, updateCount) {
        if (err) {
            callback(err, null)
        }
        callback(null, updateCount)
    })
}
//This function is called when user want to share a feature with someone
exports.share = function (req, res) {
    var featureType = req.query.type;
    var data = req.body;
    if (featureType == 'function') {
        //If no record found in the SharedFeature collection
        findUserByEmail(data.email, function (err, user) {
            if (err) {
                logger.error('Error occurred', { error: err, Date: date });
                return res.status(400).send({ message: err.message })
            }
            if (user) {
                var userId = user._id;
                FeatureRepository.find({ _id: { $in: data.sharedFeatures } }, function (err, docs) {
                    if (err) {
                        logger.error('Error while fetching functions details!', { error: err, Date: date });
                        return res.status(400).send({ message: 'Error while fetching functions details!' })
                    }
                    var dataToSave = JSON.parse(JSON.stringify(docs)).map(function (data) {
                        data.createdBy = userId;
                        delete data._id;
                        return data
                    });
                    FeatureRepository.create(dataToSave, function (err, doc) {
                        if (err) {
                            logger.error('Could not share the feature', { error: err, Date: date });
                            return res.status(400).send({ message: 'Could not share the feature!', err: err })
                        }
                        res.send({ data: doc });
                    });

                })

            } else {
                logger.error('User does not exist!', { Date: date });
                return res.status(400).send({ message: 'User does not exist!' })
            }
        });
    } else {

        if (req.user) {
            data.createdBy = req.user._id;
        } else if (req.profile) {
            data.createdBy = req.profile._id;

        } else {
            logger.error('User id is missing!', { Date: date })
            return res.status(400).send({ message: 'User id is missing!' })
        }
        data.projectId = req.project._id;
        if (!data.sharedFeatures.length) {
            logger.error('Features are missing!', { Date: date });
            res.status(400).send({ message: 'Features are missing!' })
        }
        SharedFeature.findOne({ email: data.email }, function (err, doc) {
            if (err) {
                logger.error('Error Occurred' + err, { Date: date });
                res.status(400).send({ message: 'Oops!, something went wrong' })
            }
            //If user record already present in the SharedFeature collection
            if (doc) {
                //Merging and find unique values to update.
                doc.sharedFeatures = doc.sharedFeatures.concat(data.sharedFeatures.filter(function (item) { return doc.sharedFeatures.indexOf(item) < 0 }))
                saveToSharedFeatures(doc, function (err, doc) {
                    if (err) {
                        logger.error('Error Occurred', { error: err, Date: date });
                        return res.status(400).send(err.message)
                    }
                    saveToFeatureRepository(data, function (err, data) {
                        if (err) {
                            logger.error('Could not update the shared status' + err, { Date: date });
                            res.status(400).send({ message: 'Could not update the shared status' })
                        }
                        return res.send(doc);
                    })
                })
            } else {
                //If no record found in the SharedFeature collection
                findUserByEmail(data.email, function (err, user) {
                    if (err) {
                        logger.error('Can not find user', { error: err, Date: date })
                        return res.status(400).send({ message: err.message })
                    }
                    if (user) {
                        data.userId = user._id;
                        var sharedFeature = new SharedFeature(data);
                        saveToSharedFeatures(sharedFeature, function (err, doc) {
                            if (err) {
                                logger.error('Error Occurred' + err, { Date: date });
                                return res.status(400).send(err.message)
                            }
                            saveToFeatureRepository(data, function (err, data) {
                                if (err) {
                                    logger.error('Could not update the shared status' + err, { Date: date });
                                    res.status(400).send({ message: 'Could not update the shared status' })
                                }
                                return res.send(doc);
                            })
                        })
                    } else {
                        logger.error('User does not exist!', { Date: date });
                        return res.status(400).send({ message: 'User does not exist!' })
                    }

                })
            }
        })
    }


}
//Function to save shared features
function saveToSharedFeatures(doc, callback) {
    doc.save(function (err, doc) {
        if (err) {
            logger.error('Could not update database' + err, { Date: date });
            callback({ status: false, message: 'Could not update database' }, null);
        }
        callback(null, doc)
    })
}
//Function update shared status in FeatureRepository
function saveToFeatureRepository(data, callback) {
    FeatureRepository.updateMany({ _id: { $in: data.sharedFeatures } }, { $set: { isShared: true } }, function (err, updateCount) {
        if (err) {
            logger.error('Error occurred' + err, { Date: date });
            callback(err, null)
        }
        callback(null, updateCount)
    })
}
//Function to find user by email
function findUserByEmail(email, callback) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            logger.error('Could not find any record' + err, { Date: date });
            callback({ status: false, message: 'Could not find any record' }, null)
        }
        callback(null, user);
    })
}
//This function will trigger a pscore api to merge the selected feature
exports.useSharedFeatures = function (req, res) {
    var data = req.body;
    data.currentEncoding = req.project.fileEncoding;
    //filePath is afterEdaFilePath
    // data.filePath = path.resolve(req.edaSummary.afterEdaDataFilePath);
    data.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.edaSummary.afterEdaDataFilePath });
    // data.sharedPath = path.resolve(req.feature.sharedFileName);
    data.sharedPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.feature.sharedFileName });
    var options = {
        uri: ps_core_server_url + "/api/feature_repo/use_shared_features",
        method: "POST",
        json: data
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });

}
//Function to confirm the merge from user
exports.confirmMerge = function (req, res) {
    var data = req.body;
    // fs.rename(path.resolve(data.savedPath), path.resolve(data.afterEdaDataFilePath), function(err) {
    var savedpath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: data.savedPath });
    var afterEdaDataFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: data.afterEdaDataFilePath });
    fs.rename(savedpath, afterEdaDataFilePath, function (err) {
        if (err) {
            logger.error('Could not rename file' + err, { Date: date });
            res.status(400).send({ message: 'Could not rename file' })
        }
        res.send({ message: 'Merging confirmed successfully!' })
    });

}
//API to register a function from notebook
exports.registerFunction = function (req, res) {
    var data = req.body;
    var featureRepoData = new FeatureRepository(data);
    featureRepoData.save(function (err, doc) {
        if (err) {
            logger.error('Could not save info!', { error: err, Date: date });
            res.status(400).send({ message: 'Could not save info!', err: err })
        }
        res.send(doc)
    });
}
/**
 * Middleware for finding feature by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.featureById = function (req, res, next, id) {
    FeatureRepository.findOne({ _id: id }).exec(function (err, feature) {
        if (err) {
            logger.error("Error while finding feature", { error: err, Date: date });
            return next(err);
        } else if (!feature) {
            logger.error('No feature with that identifier has been found', { Date: date });
            return res.status(404).send({ message: "No feature with that identifier has been found" });
        }
        req.feature = feature;
        next();
    })
};