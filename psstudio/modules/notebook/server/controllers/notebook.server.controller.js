/**
 * Created by winjitian.
 */
var path = require('path'),
  Notebook = mongoose.model('notebooks');
logger = require(path.resolve('./logger')),
  auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller')
multer = require('multer'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  fs = require('fs'),
  config = require("../../../../config/config"),
  glob = require("glob"),
  _ = require("lodash");
var socket = require("../../../../utils/socket/core.socket.utils");
var destination = './projects/';
//pscore host details
var pscoreHost = require("../../../../config/env/pscore.config");
var Dir = process.env.DATA_DIR || 'projects';
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var date = Date(Date.now());
date = date.toString();
/**
 * List all Projects
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  Notebook.find({ projectId: req.params.projectId }).lean().exec(function (err, docs) {
    var data = docs;
    if (err) {
      logger.error("Could not fetch notebook files", { error: err, Date: date });
      return res
        .status(400)
        .send({ message: "Could not fetch notebook files", err: err });
    }
    // var finaldest = null;
    // Globbing all the .ipynb files
    // finaldest = destination + req.params.projectId + "/notebooks/";
    var jupyterHost =
      pscoreHost.notebookHost.protocol +
      pscoreHost.notebookHost.host +
      pscoreHost.notebookHost.jupyterPort +
      "/notebooks/" +
      req.params.projectId +
      "/notebooks/";
    docs.map(function (item) {
      return item.url = jupyterHost;
    })
    res.send(docs);
    //   glob(finaldest + "/*.ipynb", function (err, files) {
    //     if (err) {
    //       logger.error("Error while loding notebook files!", { error: err });
    //       res
    //         .status(400)
    //         .send({ message: "Error while loding notebook files!" });
    //     }
    //     var fileNames = files.map(function(item){
    //             return path.basename(item);
    //     })
    //     res.send({files:fileNames,url:jupyterHost})
    //     });
  });

};

/**
 * Function to trigger notebook create API for PSCORE and saves in database
 * @param project_path root path for projects
 * @param file_name notebook filename
 * @param projectId selected project id
 */
exports.create = function (req, res) {
  var data = req.body;
  var notebookData = new Notebook(data);
  notebookData.save(function (err, doc) {
    if (err) {
      logger.error("Unable to create notebook", { error: err, Date: date });
      return res.status(400).send({ message: "Could not create notebook!" });
    } else {
      //Request options
      data.createdAt = doc.createdAt;
      var options = {
        uri: ps_core_server_url + "/api/create_notebook",
        method: "POST",
        json: data,
      };
      //Create a request
      request(options, function (error, response, body) {
        if (error) {
          logger.error("Error occurred", { error: error, Date: date });
          res.status(400).send({ message: "Could not create notebook!" });
        }
        if (!error && response.statusCode == 200) {
          var jupyterHost =
            pscoreHost.notebookHost.protocol +
            pscoreHost.notebookHost.host +
            pscoreHost.notebookHost.jupyterPort +
            "/notebooks/" +
            doc.projectId +
            "/notebooks/";

          var responseData = JSON.parse(JSON.stringify(doc))
          responseData.url = jupyterHost;
          res.send(responseData);
        }
      });
    }
  });
}

/**
 * Deletes the notebook from database and also unlinks from local machine
 * @param {*} req 
 * @param {*} res 
 */
module.exports.deleteNotebook = function (req, res) {
  Notebook.deleteOne({ _id: req.params.notebookId })
    .then(function () {
      var fileToDelete = destination + req.params.projectId + '/notebooks/' + req.params.notebookName;
      fs.unlink(path.resolve(fileToDelete), function () {
        res.send({ message: 'File deleted successfully!' });
      });
    }, function (err) {
      logger.error('Could not delete file', { error: err, Date: date });
      res.status(400).send({ message: 'Could not delete file!.' });
    })
}

/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
// exports.projectById=function(req,res,next,id)
// {
//     ProjectConfig.findById(id).exec(function(err,project){
//         if(err){
//             logger.error("Error while finding project configuration", {error: err});
//             return next(err);
//         }else if(!project){
//             return res.status(404).send({message:"No project Configuration with that identifier has been found"});
//         }
//             req.project = project;
//         next();
//     })
// };

// exports.findById = findById;
// function findById(id, callback)
// {
//     ProjectConfig.findById(id).exec(function (err, project)
//     {
//         if (err)
//         {
//             logger.error("Error while finding Project configuration", {error: err});
//             return callback(null);
//         }
//         else if (!project)
//         {
//             return callback(null);
//         }
//         callback(project);
//     })
// }
