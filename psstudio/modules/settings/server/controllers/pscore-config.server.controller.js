/**
 * Created by vishnu on 21/03/18.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    Config = mongoose.model('PsCoreConfig'),
    nodemailer = require('nodemailer'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller');
var configVars = require(path.resolve('./config/config'));
var date = Date(Date.now());
date = date.toString();
exports.createPscoreId = function (req, res) {
    logger.info('Creating  pscore config', { Date: date });
    var psCoreConfig = req.body;
    // Then save the Config
    psCoreConfig.createdBy = req.user._id;
    var config = new Config(psCoreConfig);
    config.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save pscore config' + ' error: ' + err, { Date: date });
            res.status(400).send({ statusText: 'duplicate machine name' });
        }
        else {
            logger.info('Pscore config created', { Date: date });
            res.send(doc);
        }
    });
};

exports.updateDeviceIdConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading DeviceId config' + 'error:' + err, { Date: date });
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].deviceIdConfig = req.body;
            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating DeviceId config' + 'error:' + err, { Date: date });
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated DeviceId Config', { Date: date });
                }

            });
        }
    });

};
/**
 * Update the configuration for ps core machine
 */
exports.updateConfig = function (req, res) {
    var data = req.body[0];
    var psCoreConf = req.psScoreConfig;
    psCoreConf.machineAddress = data.machineAddress;
    psCoreConf.logFilePath = data.logFilePath;
    psCoreConf.isActivated = true;
    psCoreConf.isGpuAvailable = data.isGpuAvailable;
    Config.updateOne({ _id: req.psScoreConfig._id }, {
        $set: psCoreConf
    }, function (err, resp) {
        if (err) {
            logger.error("Could not update pscore config info" + ' error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not update pscore config info" });
        }
        res.send({ message: "Updated pscore config info" })
    })
}
/**
 * Delete a machine config
 */
exports.delete = function (req, res) {
    var psScoreConfig = req.psScoreConfig;
    psScoreConfig.deleteOne(function (err) {
        if (err) {
            logger.error("Could not delete pscore config" + 'error:' + err, { Date: date });
            if (res) {
                res.status(400).send({ message: "Could not delete pscore config" });
            }
        } else {
            res.status(200).send();
            logger.info("pscore config deleted", { Date: date });
        }
    });
}
/**
 * Load All Configs
 */
exports.loadConfigs = function (req, res) {
    Config.find().exec(function (err, configuration) {
        if (err) {
            logger.error('Error while reading Menu config' + ' error: ' + err, { Date: date });
        }
        else {
            res.send(configuration);
        }
    });
};

/**
 * Middleware for finding ps core Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.psCoreConfigById = function (req, res, next, id) {
    Config.findById(id).exec(function (err, config) {
        if (err) {
            logger.error("Error while finding psconfig data" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!config) {
            return res.status(404).send({ message: "No psconfig with that identifier has been found" });
        }
        req.psScoreConfig = config;
        next();
    })
};

