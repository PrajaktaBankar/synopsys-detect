/**
 * Created by vishnu on Mon/05/2020.
 */
var path = require("path"),
  logger = require(path.resolve("./logger")),
  auditLogger = require("../../../auditlogs/server/controllers/auditlog.server.controller"),
  mongoose = require("mongoose"),
  DataDrift = mongoose.model("DataDrift"),
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
      logger.error('Could not find the data drift records' + ' error: ' + err, { Date: date })
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
 * Delete a drift report
 */
exports.delete = function (req, res) {
  DataDrift.deleteOne({ _id: req.driftreport._id }).then(function (err) {
    res.send({ message: 'Drift report deleted.' });
  }, function (err) {
    logger.error('Could not delete the drift report', { error: err, Date: date });
    return res.status(400).send({ message: 'Could not delete the drift report', err: err });
  });
}
/**
 * Start drift analysis
 */

exports.startDriftAnalysis = function (req, res) {
  var data = req.body;
  data.isMultilabel = req.trainedModel.isMultilabel,
    data.depVariable = req.trainedModel.depVariable,
    data.indepVariable = req.trainedModel.indepVariable,
    data.incomingFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainedModel.projectId, fileName: data.incomingFilepath });
  data.trainPipeFilePath = req.modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainedModel.projectId, fileName: req.modelData.trainPipeFilePath }) : null;
  data.xHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainedModel.projectId, fileName: req.modelData.xHoldout });
  data.yHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainedModel.projectId, fileName: req.modelData.yHoldout });
  data.baselineFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainedModel.projectId, fileName: req.edaData.afterEdaDataFilePath });
  data.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainedModel.projectId, fileName: data.modelPath });
  data.createdBy = req.user._id;
  //type indicates the type of drift analysis. it can be summary/feature_wise
  // var type = req.query.type || "summary";
  var options = {
    uri: ps_core_server_url + "/api/data/driftAnalysis",
    method: "POST",
    json: data,
  };
  request(options, function (error, response, body) {
    if (response.statusCode != 200) {
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
    socket.emit(
      "dataDrift",
      { status: "datadrift_failed", data: data['message'] },
      { _id: data.projectId, createdBy: data.createdBy }
    );
    res.send({ message: 'Request passed to the client.' });
  } else {
    //If type == summary insert the data to db, otherwise just return the data in socket to client
    if (data['type'] == 'summary') {
      var dataDrift = new DataDrift(data);
      dataDrift.save(function (err, doc) {
        if (err) {
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
// exports.dataDriftById = function (req, res, next, id) {
//   DataDrift.findById(id).populate({path:'incomingFileId',select:'fileSchema filename'}).exec(function (err, driftreport) {
//     if (err) {
//       logger.error("Error while finding data drift reports", { error: err });
//       return next(err);
//     } else if (!driftreport) {
//       return res
//         .status(404)
//         .send({ message: "No file with that identifier has been found" });
//     }
//     req.driftreport = driftreport;
//     next();
//   });
// };
