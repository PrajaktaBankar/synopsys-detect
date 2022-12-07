let path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
    mongoose = require('mongoose'),
    Apiaccess = mongoose.model('Apiaccess'),
    Usecase = mongoose.model('Usecase');
Models = mongoose.model('models'),
    multer = require('multer'),
    hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    fs = require('fs');
let _ = require('lodash');
let uploadUtil = require('../../../../utils/general/uploader.utils.server');
let request = require('request');
let socket = require("../../../../utils/socket/core.socket.utils");
let pscoreHost = require("../../../../config/env/pscore.config");
let ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
let config = require("../../../../config/config");
UserModule = require('../../../users/server/controllers/admin.server.controller');

/**
 * function to create usecase
 * @param {*} req 
 * @param {*} res 
 */
module.exports.createUsecase = function (req, res) {
    let data = req.body;
    data.createdBy = req.user._id;
    let usecaseData = new Usecase(data);
    usecaseData.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save usecase', { error: err });
            return res.status(400).send({ message: 'Could not create usecase!' });
        }
        else {
            logger.info('usecase created');
            res.send(doc);
        }
    });
}

/**
 * function to get usecase list
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getUsecaseList = function (req, res) {
    let queryObj;
    if (req.query.domain) {
        if (req.query.type != 'self') {
            queryObj = { usecaseType: 'default', domain: req.query.domain }
        } else {
            queryObj = { createdBy: req.user._id, domain: req.query.domain }
        }
    } else {
        if (req.query.type != 'self') {
            queryObj = { usecaseType: 'default' }
        } else {
            queryObj = { createdBy: req.user._id }
        }
    }
    Usecase.find(queryObj).populate('projectId').populate('trainingId').populate('modelId').exec(function (err, docs) {
        if (err) {
            return res.status(400).send({ message: 'Could not fetch usecase!', err: err });
        }
        res.send(docs);
    })
}

/**
 * function to get particular usecase
 * @param {*} req 
 * @param {*} res 
 */
module.exports.findOneUsecase = function (req, res) {
    res.send(req.usecaseData);
}

/**
 * function to update usecase
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updateUsecase = function (req, res) {
    let usecaseUpdate = req.usecaseData;
    usecase = _.extend(usecaseUpdate, req.body.usecase);
    usecase.save(function (err, data) {
        if (err) {
            return res.status(400).send({ meassage: 'Could not save the usecase!' })
        }
        res.send(data);

    })
}

/**
 * function to delete usecase
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deleteUsecase = function (req, res) {
    Usecase.deleteOne({ _id: req.usecaseData._id }, function (err) {
        if (err) {
            logger.error("Could not delete usecase", { error: err });
            if (res) {
                res.status(400).send({ message: "Could not delete usecase" });
            }
        } else {
            logger.info("usecase deleted");
            res.send({ message: 'Deleted usecase.' });
        }
    });
}

module.exports.generateReport = function (req, res) {
    let reportData = req.body;
    let usecaseId = req.body.usecaseId;
    queryObj = { _id: usecaseId }
    reportData.featureImpact = {}
    Usecase.find(queryObj).populate('projectId').populate('trainingId').populate('modelId').exec(function (err, docs) {
        if (err) {
            return res.status(400).send({ message: 'Could not fetch usecase!', err: err });
        }
        if (docs[0].reportFile) {
            let file = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: docs[0].projectId._id, fileName: docs[0].reportFile });
            res.download(file);
        } else {
            if (docs[0].trainingId.algoType == 'regression') {
                reportData.featureImpact.scoring = 'r2';
            } else if (docs[0].trainingId.algoType == 'classification') {
                reportData.featureImpact.scoring = 'accuracy';
            } else {
                reportData.featureImpact.scoring = 'none';
            }
            reportData.projectId = docs[0].projectId._id;
            reportData.afterEdaDataFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: docs[0].projectId._id, fileName: req.body.afterEdaDataFilePath });
            filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: docs[0].projectId._id, fileName: docs[0].modelId.modelMetaData.modelPath });
            reportData.featureImpact.modelPath = filename;
            reportData.featureImpact.xDev = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: docs[0].projectId._id, fileName: docs[0].modelId.xDev });
            reportData.featureImpact.yDev = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: docs[0].projectId._id, fileName: docs[0].modelId.yDev });
            reportData.featureImpact.iterations = 5;
            var options = {
                uri: ps_core_server_url + '/api/model/report',
                method: 'POST',
                json: reportData
            };
            //Making http call to pscore
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let dataToUpdate = { reportFile: body.reportFile };
                    Usecase.updateOne({ _id: req.body.usecaseId }, { "$set": dataToUpdate }, function (err, report) {
                        if (err) {
                            logger.error('Could not save report details', { error: err });
                            return res.status(400).send({ message: 'Could not save report details', err: err });
                        }
                        let file = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: reportData.projectId, fileName: body.reportFile });
                        res.download(file);
                    });
                    
                } else {
                    res.status(400).send(body);
                }
            });
        }
    })
}

/**
 * Middleware for finding usecase
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataByUsecaseId = function (req, res, next, id) {
    Usecase.findById(id).populate('projectId').populate('trainingId').populate('modelId').exec(function (err, config) {
        if (err) {
            logger.error("Error while finding usecase data", { error: err });
            return next(err);
        } else if (!config) {
            return res.status(404).send({ message: "No usecase with that identifier has been found" });
        }
        req.usecaseData = config;
        next();
    })
};