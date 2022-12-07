/**
 * Created by winjitian on 30/06/2020.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
    SFTPCon = mongoose.model('SFTPCon'),
    request = require('request'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller');
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var date = Date(Date.now());
date = date.toString();

/**
 * Create a new sftp connection configuration
 */
exports.create = function (req, res) {
    var data = req.body;
    data.createdBy = req.user._id;
    const key = hideandseek.keyFromPassword(data.predictsensePwd);
    const encryptedData = hideandseek.encrypt(key, data.password);
    data.password = encryptedData;
    var sFTPCon = new SFTPCon(data);
    sFTPCon.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save SFTP' + ' error: ' + err, { Date: date });
            res.status(400).send({ statusText: 'Unable to save SFTP' });
        }
        else {
            logger.info('SFTP created', { Date: date });
            res.send(doc);
        }
    });
}
/**
 * List all sftp conn configs
 */
exports.list = function (req, res) {
    var queryObj = { createdBy: req.user._id }
    SFTPCon.find(queryObj, function (err, docs) {
        if (err) {
            logger.error('Could not fetch SFTP details' + ' error:' + err, { Date: date });
            return res.status(400).send({ message: 'Could not fetch SFTP details!', err: err });
        }
        res.send(docs);
    })
}
/**
 * Function to test the sftp connection settings
 */
exports.testConnection = function (req, res) {
    var data = req.body;
    data.source = 'sftp';
    var options = {
        //uri: ps_core_server_url + '/api/sftp/test_connection',
        uri: ps_core_server_url + '/api/test_connection',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        // If everthing ges well response will come in html format, you can bind this html in 
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}

/**
 * Function to get the Folder Structure 
 */
exports.folderStructure = function (req, res) {
    var changeParams = '';
    if (req.query.path == 'first') {
        changeParams = '/'
    } else {
        changeParams = req.query.path;
    }
    var datas = {
        "username": req.dbConn.username,
        "password": req.dbConn.password,
        "address": req.dbConn.address,
        "port": req.dbConn.port,
        "path": changeParams,
    }
    var options = {
        uri: ps_core_server_url + '/GetfolderStructure',
        method: 'POST',
        json: datas
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send([body]);
        } else {
            res.status(400).send(body);
        }
    });
}
/**
 * Find one record by id
 */
exports.findOne = function (req, res) {
    var data = req.dbConn;
    res.send(data);
}
/**
 * Update a particular sftp 
 */
exports.update = async (req, res) => {
    try {
        var data = req.body;
        delete req.body._id;
        console.log(data, '*******************************************', req);
        const key = hideandseek.keyFromPassword(data.predictsensePwd);
        const encryptedData = hideandseek.encrypt(key, data.password);
        data.password = encryptedData;
        const docs = await SFTPCon.findByIdAndUpdate({ _id: req.params.sftpId }, { ...data });
        if (!docs) {
            return res.send({ message: 'Could not Update SFTP' });
        }
        res.send(docs);
    } catch (error) {
        logger.error('Could not Update SFTP', {
            error: error.message,
            Date: new Date().toString(),
        });
        res.status(400).send({ message: 'Could not Update SFTP' });
    }
}
/**
 * Delete a sftp config
 */
exports.delete = function (req, res) {
    SFTPCon.deleteOne({ _id: req.dbConn._id }, function (err) {
        if (err) {
            logger.error("Could not delete SFTP" + ' error: ' + err, { Date: date });
            if (res) {
                res.status(400).send({ message: "Could not delete SFTP" });
            }
        } else {
            logger.info("SFTP deleted", { Date: date });
            res.send({ message: 'Deleted SFTP.' });
        }
    });
}


/**
 * Middleware for finding ps core Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dbsftpById = function (req, res, next, id) {
    SFTPCon.findById(id).exec(function (err, config) {
        if (err) {
            logger.error("Error while finding dbconn data" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!config) {
            return res.status(404).send({ message: "No dbconn with that identifier has been found" });
        }
        const key = hideandseek.keyFromPassword();
        const decryptedData = hideandseek.decrypt(key, config.password);
        config.password = decryptedData;
        req.dbConn = config;
        next();
    })
};
