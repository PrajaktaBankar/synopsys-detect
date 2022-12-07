/**
 * Created by saket on 6/10/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    Config = mongoose.model('Config'),
    nodemailer = require('nodemailer'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller');
var configVars = require(path.resolve('./config/config'));

exports.createIfNoConfigExist = function () {
    Config.findOne().exec(function (err, config) {
        if (err) {
            logger.error('Unable to get default Config');
        }

        var changed = false;

        if (!config) {
            config = new Config();
        }
        if (!config.smtpConfig) {
            config.smtpConfig = {
                email: 'winjitiot@gmail.com',
                password: 'winjit@123',
                server: 'smtp.gmail.com',
                port: '465',
                secure: true, //Use SSL
                security: 'SSL/TLS',
                authenticationMethod: 'kerberos',
                service: 'other'
            };
            changed = true;
        }
        if (!config.zigbeeConfig) {
            config.zigbeeConfig = {
                deviceName: 'Digi_XStick'
            };
            changed = true;
        }
        if (!config.smsConfig) {
            config.smsConfig = {
                accountId: 'admin',
                authToken: 'password',
                mobileNum: '+17077376293'

            };
            changed = true;
        }
        if (!config.remoteConfig) {
            config.remoteConfig = {
                isOn: false,
                endpoint: 'mqtt://www.winjit.com',
                username: 'admin',
                password: 'password'
            };
            changed = true;
        }
        if (!config.compressionConfig) {
            config.compressionConfig = {
                decompressorUrl: 'http://example.com'
            };
            changed = true;
        }
        if (!config.purgeConfig) {
            config.purgeConfig = {
                isDataPurge: false,
                expDay: 90
            };
            changed = true;
        }
        if(!config.deviceIdConfig){
            config.deviceIdConfig = {
                isAutoCreateDeviceId: true
            }
            changed = true;
        }
        if (!config.menuConfig) {
            config.menuConfig = {
                isDashboard: true,
                isSync: true,
                isDevice: true,
                isData: true,
                isSNMP: true,
                isModbus: true,
                isOPC: true,
                isUDD: true,
                isAnalytics: true,
                isComputing: true,
                isUsers: true,
                isSettings: true,
                isHelp: true
            };
            changed = true;
        }
        if (changed) {
            logger.info('Creating  Default Config');
            // Then save the Config
            config.save(function (err) {
                if (err) {
                    logger.error('Unable to save Default Config', {error: err});
                }
                else {
                    logger.info('Default Config Created');
                }
            });
        }
    })
};

/**
 * SMTP Config
 */
exports.readSMTP = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].smtpConfig);
        }
    });
};
exports.updateSMTP = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].smtpConfig = req.body;

            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating SMTP config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated SMTP Config');
                }

            });
        }
    });
};

/**
 * Zigbee Config
 */
exports.readZigbee = function (req, res) {

    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].zigbeeConfig);
        }
    });
};
exports.updateZigbee = function (req, res) {
  

    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].zigbeeConfig = req.body;

            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating Zigbee config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated Zigbee Config');
                   
                }

            });
        }
    });
};

/**
 * Compression Config
 */
exports.readCompression = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].compressionConfig);
        }
    });
};
exports.updateCompression = function (req, res) {
 
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading  config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].compressionConfig = req.body;

            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating Compression config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated Compression Config');
                  
                }

            });
        }
    });

};

/**
 * SMS Config
 */
exports.readSms = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].smsConfig);
        }
    });
};
exports.updateSms = function (req, res) {


    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].smsConfig = req.body;

            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating SMS config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated SMS Config');
                }

            });
        }
    });
};

/**
 * Remote Config
 */
exports.readRemote = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].remoteConfig);
           
        }
    });
};
exports.updateRemote = function (req, res) {
  

    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading  config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].remoteConfig = req.body;

            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating REMOTE config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated REMOTE Config');
                    require('../../../../utils/remote-config/core.remote-config.utils').init();
                }

            });
        }
    });

};

/**
 * Purge Config
 */
exports.readPurgeConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading Purge config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].purgeConfig);
        }
    });
};
exports.updatePurgeConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading Purge config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].purgeConfig = req.body;

            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating Purge config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated Purge Config');
                }

            });
        }
    });

};

/**
 * DeviceId Config
 */
exports.readDeviceIdConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading Device-Id config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].deviceIdConfig);
        }
    });
};
exports.updateDeviceIdConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading DeviceId config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].deviceIdConfig = req.body;
            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating DeviceId config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated DeviceId Config');
                }

            });
        }
    });

};

/****
 * Menu Config
 * ***/
exports.readMenuConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading Device-Id config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(config[0].menuConfig);
        }
    });
};
exports.updateMenuConfig = function (req, res) {
    Config.find().exec(function (err, config) {
        if (err) {
            logger.error('Error while reading Menu config', {error: err});
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            config[0].menuConfig = req.body;
            config[0].save(function (err) {
                if (err) {
                    logger.error('Error while updating menu config', {error: err});
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                else {
                    res.json(config[0]);
                    logger.info('Updated Menu Config');
                    configVars.menuConfig = req.body;
                }
            });
        }
    });
};

/**
 *    send test mail before saving email settings
 **/
exports.send = function (req, res) {

    var smtpTransport = nodemailer.createTransport({
        host: req.body.server,
        port: req.body.port,
        requiresAuth: true,
        tls: req.body.tls,
        secure: req.body.secure, // use SSL
        auth: {
            user: req.body.email,
            pass: req.body.password
        }
    });
    var mailOptions = {
        to: req.body.testEmail,
        from: req.body.email,
        subject: 'Test Mail from IoTSense',
        text: 'Test Mail',
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
            logger.info('An test email has been sent to ' + req.body.testEmail + '.');
            res.send({
                message: 'An test email has been sent to ' + req.body.testEmail + '.'
            });
        } else {
            logger.error('Email settings provided by you are incorrect', {error: err});
            res.sendStatus(500);
            return;
        }
    });


};

/**
 * Load All Configs
 */
exports.loadConfigs = function () {
    Config.find().exec(function (err, configuration) {
        if (err) {
            logger.error('Error while reading Menu config', {error: err});
        }
        else {
            if (!configuration.length || !configuration[0].menuConfig) {
                configVars.menuConfig = {
                    isDashboard: true,
                    isSync: true,
                    isDevice: true,
                    isData: true,
                    isSNMP: true,
                    isModbus: true,
                    isOPC: true,
                    isUDD: true,
                    isAnalytics: true,
                    isComputing: true,
                    isUsers: true,
                    isSettings: true,
                    isHelp: true
                };
            }
            else {
                configVars.menuConfig = configuration[0].menuConfig;
            }
        }
    });
};

