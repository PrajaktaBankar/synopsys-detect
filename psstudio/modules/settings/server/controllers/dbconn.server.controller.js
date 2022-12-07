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
  DbConn = mongoose.model('DbConn'),
  request = require('request'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller');
var pscoreHost = require('../../../../config/env/pscore.config');
var ps_core_server_url =
  pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var date = Date(Date.now());
date = date.toString();

/**
 * Create a new Database connection configuration
 */
exports.create = function (req, res) {
  var data = req.body;
  data.createdBy = req.user._id;
  var key = hideandseek.keyFromPassword(data.predictsensePwd);
  var encryptedData = hideandseek.encrypt(key, data.password);
  data.password = encryptedData;
  var dbConn = new DbConn(data);
  dbConn.save(function (err, doc) {
    if (err) {
      logger.error('Failed to save db configuration error: ' + err, { Date: date });
      res.status(400).send({ message: 'Failed to save db configurations!' });
    }
    res.send(doc);
  });
};

/**
 * Create a new connection as per the type
 */
exports.createNew = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user._id;
    const key = hideandseek.keyFromPassword(data.predictsensePwd);
    if (req.params.type === 'snowflake') {
      const encryptedData = hideandseek.encrypt(key, data.password);
      data.password = encryptedData;
    } else if (req.params.type === 's3') {
      const encryptedData = hideandseek.encrypt(key, data.awsSecretKey);
      data.awsSecretKey = encryptedData;
    } else if (req.params.type === 'bigquery') {
      const encryptedData = hideandseek.encrypt(key, data.bqPrivateKey);
      data.bqPrivateKey = encryptedData;
    }
    const docs = await new DbConn(data).save();
    if (!docs) {
      return res.send({ message: 'Cannot create a connection' });
    }
    res.send(docs);
  } catch (error) {
    logger.error('Connection creation failed', { error: error.message, Date: date });
    return error.code === 11000
      ? res.status(400).send({ message: 'Connection name already exists' })
      : res.status(400).send({ message: err.message });
  }
};

/**
 * List all db conn configs
 */
exports.list = function (req, res) {
  var queryObj = {};
  if (req.query.hasOwnProperty('source')) {
    queryObj = { createdBy: req.user._id, source: req.query.source };
  } else {
    queryObj = { createdBy: req.user._id };
  }
  DbConn.find(queryObj, function (err, docs) {
    if (err) {
      logger.erro('Could not fetch config details error: ' + err, { Date: date });
      res.status(400).send({ message: 'Could not fetch config details!', err: err });
    }
    // Filters the connection to exclude snowflake and s3
    docs = docs.filter(
      (i) => i.source !== 'snowflake' && i.source !== 's3' && i.source !== 'bigquery'
    );
    res.send(docs);
  });
};

/**
 * Fetches the list of all connections as per the type
 * @param {*} req
 * @param {*} res
 */
exports.getList = async (req, res) => {
  try {
    const docs = await DbConn.find({ createdBy: req.user._id, source: req.params.type });
    res.send(docs);
  } catch (error) {
    logger.error('Fetching connections list failed', {
      error: error.message,
      Date: new Date().toString(),
    });
    res.status(400).send({ message: 'Failed to fetch connection list' });
  }
};

/**
 * Function to test the connection settings
 */
exports.testConnection = function (req, res) {
  var data = req.body;
  var options = {
    uri: ps_core_server_url + '/api/test_connection',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    // If everthing ges well response will come in html format, you can bind this html in angularjs
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      logger.erro('Could not test connection error: ' + body, { Date: date });
      res.status(400).send(body);
    }
  });
};

/**
 * Function to test the created connection
 */
exports.testCreatedConnection = async (req, res) => {
  try {
    let data = req.body;
    if (req.params.type === 's3') {
      data.awsService = 's3';
    }
    if (req.params.type === 'bigquery') {
      data.bqPrivateKey = data.bqPrivateKey.replace(/\\n/g, '\n');
    }
    const options = {
      uri: ps_core_server_url + '/api/test_connection',
      method: 'POST',
      json: data,
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.send(body);
      } else {
        logger.error('Could not test connection: ' + body, { Date: date });
        res.status(400).send(body);
      }
    });
  } catch (error) {
    logger.error('Cannot test the connection: ' + error, { Date: date });
    res.status(400).send({ message: 'Cannot test the connection', err: error });
  }
};

/**
 * Find one record by id
 */
exports.findOne = function (req, res) {
  var data = req.dbConn;
  res.send(data);
};
/**
 * Update a particular dbConn
 */
exports.update = function (req, res) {
  var data = req.body;
  var dbConn = req.dbConn;
  dbConn.name = data.name;
  dbConn.source = data.source;
  if (data.source == 'mssql') {
    dbConn.driver = data.driver;
  }
  dbConn.address = data.address;
  dbConn.port = data.port;
  dbConn.username = data.username;
  var key = hideandseek.keyFromPassword(data.predictsensePwd);
  var encryptedData = hideandseek.encrypt(key, data.password);
  dbConn.password = encryptedData;
  // dbConn.password = data.password;
  dbConn.save(function (err, doc) {
    if (err) {
      logger.erro('Error while updating the details error: ' + err, { Date: date });
      res.status(400).send({ message: 'Error while updating the details', err: err });
    }
    res.send(doc);
  });
};

/**
 * Update a particular dbConn
 */
exports.updateConnection = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user._id;
    const key = hideandseek.keyFromPassword(data.predictsensePwd);
    if (req.params.type === 'snowflake') {
      const encryptedData = hideandseek.encrypt(key, data.password);
      data.password = encryptedData;
    } else if (req.params.type === 's3') {
      const encryptedData = hideandseek.encrypt(key, data.awsSecretKey);
      data.awsSecretKey = encryptedData;
    } else if (req.params.type === 'bigquery') {
      const encryptedData = hideandseek.encrypt(key, data.bqPrivateKey);
      data.bqPrivateKey = encryptedData;
    }
    const docs = await DbConn.findByIdAndUpdate({ _id: req.params.connId }, { ...data });
    if (!docs) {
      return res.send({ message: 'Cannot update a connection' });
    }
    res.send(docs);
  } catch (error) {
    logger.error('Connection updating failed', {
      error: error.message,
      Date: new Date().toString(),
    });
    res.status(400).send({ message: 'Failed to update the connection' });
  }
};

/**
 * Delete a dbconn config
 */
exports.delete = function (req, res) {
  var dbConn = req.dbConn;
  dbConn.deleteOne(function (err) {
    if (err) {
      logger.error('Could not delete dbconn config' + 'error: ' + err, { Date: date });
      if (res) {
        res.status(400).send({ message: 'Could not delete dbconn config' });
      }
    } else {
      logger.info('dbconn config deleted', { Date: date });
      res.send({ message: 'Deleted dbconn config.' });
    }
  });
};

/**
 * Deletes the specific connection
 */
exports.deleteConnection = async (req, res) => {
  try {
    const docs = await DbConn.findOneAndDelete({ _id: req.params.connId, source: req.params.type });
    if (!docs) {
      return res.send({ message: 'Cannot delete a connection setting' });
    }
    res.send(docs);
  } catch (error) {
    logger.info('Cannot delete connection setting', { Date: date });
    res.send({ message: 'Connection setting deleted' });
  }
};

/**
 * Function to get the Folder Structure
 */
exports.getS3BucketsList = async (req, res) => {
  try {
    const docs = await DbConn.findOne({ _id: req.params.connId, source: 's3' });
    if (!docs) {
      return res.send({ message: 'Connection details not found' });
    }
    const key = hideandseek.keyFromPassword();
    docs.awsSecretKey = hideandseek.decrypt(key, docs.awsSecretKey);
    var options = {
      uri: ps_core_server_url + '/api/data/s3_structure',
      method: 'POST',
      json: docs,
    };
    request(options, function (error, response, body) {
      console.log('🚀 ~ body --->', body);
      if (!error && response.statusCode === 200) {
        res.send(body);
      } else {
        res.status(400).send(body);
      }
    });
  } catch (error) {
    logger.info('Cannot fetch S3 buckets list', { Date: date });
    res.send({ message: 'Cannot fetch S3 buckets list' });
  }
};

/**
 * Middleware for finding ps core Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dbconnById = function (req, res, next, id) {
  DbConn.findById(id).exec(function (err, config) {
    if (err) {
      logger.error('Error while finding dbconn data' + 'error:' + err, { Date: date });
      return next(err);
    } else if (!config) {
      return res.status(404).send({ message: 'No dbconn with that identifier has been found' });
    }
    req.dbConn = config;
    next();
  });
};
