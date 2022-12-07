/**
 * Created by vishnu on Mon/05/2020.
 */
var path = require("path"),
  logger = require(path.resolve("./logger")),
  auditLogger = require("../../../auditlogs/server/controllers/auditlog.server.controller"),
  mongoose = require("mongoose"),
  DataDrift = mongoose.model("DataDrift"),
  DriftConfig = mongoose.model("DriftConfig"),
  TrainedModel = mongoose.model('trainedModel'),
  errorHandler = require("../../../core/server/controllers/errors.server.controller");
var uploadUtil = require('../../../../utils/general/uploader.utils.server');

var _ = require("lodash");
var request = require("request");
var socket = require("../../../../utils/socket/core.socket.utils");
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url =
  pscoreHost.hostDetails.protocol +
  pscoreHost.hostDetails.host +
  pscoreHost.hostDetails.port;
var config = require("../../../../config/config");
//PSCORE HOST
var ps_core_server_url =
  pscoreHost.hostDetails.protocol +
  pscoreHost.hostDetails.host +
  pscoreHost.hostDetails.port;
var request = require("request");
var date = Date(Date.now());
date = date.toString();
/**
 * List all the data drift reports based on project id
 */
exports.list = function (req, res) {
  DataDrift.find({ projectId: req.project._id }, function (err, docs) {
    if (err) {
      logger.error('Could not find the data drfit records.' + 'projectId' + req.project._id, { error: err, Date: date })
      return res
        .status(400)
        .send({ message: "Could not find the data drfit records.", err: err });
    }
    res.send(docs);
  });
};

/**
 * Get one drift report
 */
exports.listOne = function (req, res) {
  return res.send(req.driftreport);
};
/**
 * Start drift analysis
 */

exports.startDriftAnalysis = function (req, res) {
  var data = req.body;
  var modelData = req.modelData;
  var trainingData = req.trainingData;
  data.isMultilabel = req.edaData.isMultilabel,
    data.depVariable = req.edaData.depVariable,
    data.indepVariable = trainingData.indepVariable,
    data.incomingFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: data.incomingFilepath });
  data.trainPipeFilePath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.trainPipeFilePath }) : null;
  data.transformedDatasetPath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.transformedDatasetPath }) : null;
  data.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
  data.baselineFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.fileId.filename });
  data.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.modelMetaData.modelPath });
  data.baselineSchema = req.edaData.edaSummary.map(function (item) {
    var obj = { colName: item.colName, dataType: item.dataType };
    return obj;
  });
  data.edaSummary = req.edaData.edaSummary;
  data.createdBy = req.user._id;
  data.indepVariable = trainingData.indepVariable;
  data.projectId = trainingData.projectId;
  data.modelId = modelData._id;
  data.trainingId = trainingData._id;
  data.edaId = req.edaData._id;
  data.classNames = req.edaData.classNames;
  var options = {
    uri: ps_core_server_url + "/api/data/driftAnalysis",
    method: "POST",
    json: data,
  };
  request(options, function (error, response, body) {
    if (response.statusCode != 200) {
      logger.error('Drift analysis could not start' + error, { Date: date })
      res.send({ message: "Drift analysis could not start" });
    } else {
      res.send({ message: "Drift analysis started" });
    }
  });
};

/**
 * Completed drift analysis
 */
exports.driftAnalysisDone = function (req, res) {
  var data = req.body;
  if (data['status'] == 'failed') {
    logger.error('Data drift failed' + 'projectId: ' + data.projectId, { Date: date });
    socket.emit(
      "dataDrift",
      { status: "datadrift_failed", data: data['message'] },
      { _id: data.projectId, createdBy: data.createdBy }
    );
    res.send({ message: 'Request passed to the client.' });
  } else {
    //If type == summary insert the data to db, otherwise just return the data in socket to client
    if (data['type'] === 'summary') {
      var dataDrift = new DataDrift(data);
      dataDrift.save(function (err, doc) {
        if (err) {
          logger.error('Data drift failed' + 'projectId: ' + data.projectId + err, { Date: date });
          socket.emit(
            "dataDrift",
            { status: "datadrift_failed", data: doc },
            { _id: data.projectId, createdBy: data.createdBy }
          );
          return res
            .status(400)
            .send({ message: "Could not save data drift report", err: err });
        }
        socket.emit(
          "dataDrift",
          { status: "datadrift_success", data: doc },
          { _id: data.projectId, createdBy: data.createdBy }
        );
        res.send(doc);
      });
    } else {
      socket.emit(
        "dataDrift",
        { status: "datadrift_success", data: data },
        { _id: data.projectId, createdBy: data.createdBy }
      );
      res.send({ message: 'Request passed to the client.' })
    }
  }

};
/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataDriftById = function (req, res, next, id) {
  DataDrift.findById(id)
    .populate(
      { path: 'incomingFileId', select: 'fileSchema filename noOfRows noOfCols' }
    ).populate(
      { path: 'trainingId', select: 'depVariable name' }
    ).populate('modelId').exec(function (err, driftreport) {
      if (err) {
        logger.error("Error while finding data drift reports", { error: err, Date: date });
        return next(err);
      } else if (!driftreport) {
        return res
          .status(404)
          .send({ message: "No file with that identifier has been found" });
      }
      req.driftreport = driftreport;
      next();
    });
};

// Inserts the data drift configuration
exports.insertDriftConfig = function (req, res, next) {
  var config = new DriftConfig(req.body);
  config.save(function (err, doc) {
    if (err) {
      logger.error('Could not save data drift config', { error: err, Date: date });
      return res
        .status(400)
        .send({ message: "Could not save data drift config", err: err });
    }
    res.send(doc);
  });
};

// Fetches all drift configurations
exports.getAllDriftConfigs = function (req, res) {
  DriftConfig.find({ projectId: req.params.projectId }, function (err, docs) {
    if (err) {
      logger.error('Could not find data drift records', { error: err, Date: date });
      return res
        .status(400)
        .send({ message: "Could not find data drfit records.", err: err });
    }
    res.send(docs);
  });
}

// Deletes the configuration
exports.deleteConfig = function (req, res) {
  DriftConfig.deleteOne({ _id: req.params.configId, projectId: req.params.projectId }, function (err, docs) {
    if (err) {
      logger.error('Could not delete data drift configuration.', { error: err, Date: date });
      return res
        .status(400)
        .send({ message: "Could not delete data drift configuration.", err: err });
    }
    res.send(docs);
  });
}

/**
 * Deletes a drift report from DB
 */
exports.deleteReport = function (req, res) {
  DataDrift.deleteOne({ _id: req.params.driftReportId, projectId: req.params.projectId }, function (err, docs) {
    if (err) {
      logger.error('Could not delete data drift report.', { error: err, Date: date });
      return res
        .status(400)
        .send({ message: "Could not delete drift report.", err: err });
    }
    res.send(docs);
  });
}

// Updates the configuration
exports.updateConfig = function (req, res) {
  queryObj = { _id: req.params.configId, projectId: req.params.projectId };
  DriftConfig.findOneAndUpdate(queryObj, { "$set": req.body }, { new: true }, function (err, docs) {
    if (err) {
      logger.error('Could not update data drift configuration.', { error: err, Date: date });
      return res
        .status(400)
        .send({ message: "Could not update configuration.", err: err });
    }
    res.send(docs);
  });
}