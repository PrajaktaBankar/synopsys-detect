let path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
    mongoose = require('mongoose'),
    Apiaccess = mongoose.model('Apiaccess'),
    Usecase = mongoose.model('Usecase');
    Domain = mongoose.model('Domain');
Models = mongoose.model('models'),
    multer = require('multer'),
    hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    fs = require('fs');
let _ = require('lodash');
let request = require('request');
let socket = require("../../../../utils/socket/core.socket.utils");
let pscoreHost = require("../../../../config/env/pscore.config");
let ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
let config = require("../../../../config/config");
UserModule = require('../../../users/server/controllers/admin.server.controller');
/**
 * function to create domain
 * @param {*} req 
 * @param {*} res 
 */
 module.exports.createDomain = function (req, res) {
    let data = req.body;
    data.createdBy = req.user._id;
    let domainData = new Domain(data);
    domainData.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save domain', { error: err });
            return res.status(400).send({ message: 'Could not create domain!' });
        }
        else {
            logger.info('domain created');
            res.send(doc);
        }
    });
}

/**
 * function to get domain list
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getDomainList = function (req, res) {
    let queryObj = {};
    Domain.find(queryObj, function (err, docs) {
        if (err) {
            return res.status(400).send({ message: 'Could not fetch Domain!', err: err });
        }
        res.send(docs);
    })
}

/**
 * function to get particular domain
 * @param {*} req 
 * @param {*} res 
 */
module.exports.findOneDomain = function (req, res) {
    res.send(req.domainData);
}

/**
 * function to update domain
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updateDomain = function (req, res) {
    let domainUpdate = req.domainData;
    domain = _.extend(domainUpdate, req.body.domain);
    domain.save(function (err, data) {
        if (err) {
            return res.status(400).send({ meassage: 'Could not save the domain!' })
        }
        res.send(data);

    })
}

/**
 * function to delete domain
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deleteDomain = function (req, res) {
    Domain.deleteOne({ _id: req.domainData._id }, function (err) {
        if (err) {
            logger.error("Could not delete domain", { error: err });
            if (res) {
                res.status(400).send({ message: "Could not delete domain" });
            }
        } else {
            logger.info("domain deleted");
            res.send({ message: 'Deleted domain.' });
        }
    });
}

/**
 * Middleware for finding domain
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataByDomainId = function (req, res, next, id) {
    Domain.findById(id).exec(function (err, config) {
        if (err) {
            logger.error("Error while finding domain data", { error: err });
            return next(err);
        } else if (!config) {
            return res.status(404).send({ message: "No domain with that identifier has been found" });
        }
        req.domainData = config;
        next();
    })
};