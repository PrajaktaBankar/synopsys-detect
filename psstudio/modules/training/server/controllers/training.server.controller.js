/**
 * Created by vishnu on 17/10/17.
 */
var path = require('path'),
  logger = require(path.resolve('./logger')),
  auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
  mongoose = require('mongoose'),
  hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
  ProjectConfig = mongoose.model('projectConfig'),
  Trainings = mongoose.model('trainings'),
  Models = mongoose.model('models'),
  Plans = mongoose.model('plans'),
  timseriesGroup = mongoose.model('tsGroup'),
  TrainedModelData = mongoose.model('trainedModelData'),
  multer = require('multer'),
  errorHandler = require('../../../core/server/controllers/errors.server.controller'),
  fs = require('fs'),
  Eda = mongoose.model('eda');
var _ = require('lodash');
var request = require('request');
var socket = require('../../../../utils/socket/core.socket.utils');
var pscoreHost = require('../../../../config/env/pscore.config');
var ps_core_server_url =
  pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var config = require('../../../../config/config');
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var coreUtil = require('../../../../utils/system/core.system.utils');
const basicSubscription = require('../../../../config/env/plans/basic-subscription');
const proSubscription = require('../../../../config/env/plans/pro-subscription');
var date = Date(Date.now());
date = date.toString();
/**
 * Function to check the training limit
 * @param {} project contains project details.
 * @param {*} callback
 */
function checkTrainingLimit(req, callback) {
  if (config.app.type === "enterprise" && !config.license.trainingLimit) {
    return callback(true);
  }
  let userPlanType;
  if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
    userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
    let startDate = new Date(req.subscription?.planStart).toISOString();
    let endDate = new Date().toISOString();
  }
  Trainings.find({ projectId: req.project._id })
    .countDocuments()
    .exec(function (err, count) {
      if (err) {
        logger.error('Unable to get count of trainings', { error: err, Date: date });
        return callback(false);
      } else {
        //the request is from saas and user is not super_admin
        if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin')) {
          let trainingCount = null;
          let data = null;
          Plans.findOne({ planType: userPlanType }, function (err, planTemplateData) {
            if (err) {
              logger.error('Can not add new Plan to the plans collection', { Date: date })
              return res.status(400).send(err.message);
            }
            data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'training');
            data.rules.find(item => {
              if (item.name === 'numberoftrainingallowed/project') {
                trainingCount = item.allowedValues;
              }
            });
            return callback(count >= trainingCount);
          });
          // if (userPlanType === "pro") {
          //   trainingCount = proSubscription.training.trainingCount;
          // } else if (userPlanType === "basic") {
          //   trainingCount = basicSubscription.training.trainingCount;
          // }
        } else {
          return callback(count >= config.license.trainingLimit);
        }
      }
    });
}

//API to generate component visualization
module.exports.visualizeComponent = function (req, res) {
  var data = req.body;
  data.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.indexPath,
  });
  data.filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.filename,
  });
  data.parentPipelineFilename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.parentPipelineFilename,
  });
  data.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.afterEdaDataFilePath,
  });

  var options = {
    uri: ps_core_server_url + '/api/timeseries/visualize_components',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      logger.error('Can not visualise component', { Date: date })
      res.status(400).send(body);
    }
  });
};

// Api for correlation graph
module.exports.autoCorrelationGraph = function (req, res) {
  var data = req.body;
  data.parentPipelineFilename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.parentPipelineFilename,
  });
  data.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.indexPath,
  });
  data.filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.filename,
  });
  data.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.afterEdaDataFilePath,
  });

  var options = {
    uri: ps_core_server_url + '/api/timeseries/plot_autocorrelation',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      logger.error('Can not plot auto-correlation graph', { Date: date })
      res.status(400).send(body);
    }
  });
};

// Api for cluster optimization
module.exports.optimiseCluster = function (req, res) {
  var data = req.body;
  data.createdBy = req.user._id;
  data.projectId = req.project._id;
  data.fileEncoding = req.project.fileEncoding;
  data.parentPipelineFilename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.parentPipelineFilename,
  });
  data.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.indexPath,
  });
  data.noOfFeatures = data.indepVariable.length;
  var options = {
    uri: ps_core_server_url + '/api/clustering/preprocessing',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(400).send(body);
    }
  });
};

//API to trigger stationarity test
module.exports.stationarityTest = function (req, res) {
  var data = req.body;
  data.parentPipelineFilename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.parentPipelineFilename,
  });
  data.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.indexPath,
  });
  data.filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.filename,
  });
  data.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.afterEdaDataFilePath,
  });
  var options = {
    uri: ps_core_server_url + '/api/timeseries/perform_stationarity_test',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({ data: body });
    } else {
      logger.error('Can not perform stationarity test', { Date: date })
      res.status(400).send(body);
    }
  });
};

/**
 * Retrain the model
 */
module.exports.reTrainModel = function (req, res) {
  var reTrainingData = req.body;
  var bestParams = null;
  var modelData = req.modelData;
  var trainingData = req.trainingData;

  if (reTrainingData.connectionSettings && reTrainingData.connectionSettings.connection) {
    var key = hideandseek.keyFromPassword();
    reTrainingData.connectionSettings.connection.password = hideandseek.decrypt(
      key,
      reTrainingData.connectionSettings.connection.password
    );
  }
  reTrainingData.filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: trainingData.projectId,
    fileName: req.body.filename,
  });
  // advTrainData.trainingId = trainingData._id;
  // advTrainData.modelId = modelData._id;
  var trainedModelData = req.trainingData.modelMetaData;
  //Get the algorithm name
  var tempAlgoName = reTrainingData['algorithms'][0].split('-')[0];
  if (reTrainingData.mergeDataset) {
    reTrainingData.originalFilePath = uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: trainingData.projectId,
      fileName: req.trainingData.metaInfo.fileName,
    });
  }
  // reTrainingData['algorithms'] = tempAlgoName;
  Eda.find({ _id: trainingData['edaId'] }).exec(function (err, doc) {
    var tempSequence = [];
    reTrainingData.dimReductionFitSize = doc[0]['dimReductionFitSize']
      ? doc[0]['dimReductionFitSize']
      : 1;
    if (modelData['modelMetaData']['bestParams']) {
      if (modelData['modelMetaData'].modelTuning) {
        bestParams =
          modelData['modelMetaData']['bestParams'][modelData['modelMetaData'].modelTuning];
      } else {
        bestParams = modelData['modelMetaData']['bestParams']['hpt'];
      }
    }
    // bestParams = modelData['modelMetaData']['bestParams'] ? modelData['modelMetaData']['bestParams'][modelData.modelTuning]: modelData['modelMetaData']['bestParams']['hpt'];
    reTrainingData.bestParams = bestParams;
    // var iteration = tempSequence.sort()[tempSequence.length-1];
    // reTrainingData.iteration = 'Iteration-'+iteration;
    // reTrainingData.iteration = req;
    if (reTrainingData.sourceType == 'file') {
      reTrainingData.retrainingDataFilename = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: trainingData.projectId,
        fileName: req.body.retrainingDataFilename,
      });
    } else {
      reTrainingData.fileSchema = req.fileData ? req.fileData.fileSchema : null;
      reTrainingData.retrainingDataFilename = null;
    }
    reTrainingData.depVariable = trainingData.depVariable;
    reTrainingData.indepVariable = trainingData.indepVariable;
    reTrainingData.isMultilabel = trainingData.isMultilabel;
    reTrainingData.testSize = trainingData.testSize;
    reTrainingData.datasetInfo = reTrainingData.dataSetInfo;
    // reTrainingData.useGPU = req.project['useGPU'];
    reTrainingData.modelFilePath = uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: trainingData.projectId,
      fileName: reTrainingData.modelFile,
    });
    var hpt = [];
    if (trainingData['hptPreference']) {
      hpt = trainingData.hptPreference.filter(function (data) {
        return data.algoName == reTrainingData['algorithms'][0];
      });
    }
    reTrainingData.hptPreference = hpt;
    reTrainingData.createdBy = req.user._id;
    reTrainingData.trainingId = trainingData._id;
    if (trainingData['predictiveModelingInfo']) {
      reTrainingData.predictiveModelingInfo = trainingData['predictiveModelingInfo'];
    }
    reTrainingData.predictiveModelingInfo.sampling = req.body.sampling;
    reTrainingData.fileEncoding = trainingData.fileEncoding;
    reTrainingData.classNames = trainingData.classNames;
    reTrainingData.xTrain = null;
    reTrainingData.yTrain = null;
    reTrainingData.xHoldout = null;
    reTrainingData.yHoldout = null;
    reTrainingData.xDev = null;
    reTrainingData.yDev = null;
    var trainPipeFilePath = null;
    reTrainingData.trainPipeFilePath = uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: trainingData.projectId,
      fileName: modelData.trainPipeFilePath,
    });
    var algos = trainingData['algorithms'];
    algos.push(reTrainingData['algorithms'][0] + reTrainingData.iteration);
    var options = {
      uri: ps_core_server_url + '/api/model/retrain/start',
      method: 'POST',
      json: reTrainingData,
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send({ algorithms: algos, trainingId: trainingData._id });
      } else {
        res.status(400).send({ message: 'Failed to start retraining.' });
      }
    });
  });
};

/**
 * function to find unique categories
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getUniqueCategories = function (req, res) {
  let filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.body.projectId,
    fileName: req.body.filename,
  });
  let uniqueCatData = {
    filename: filename,
    colName: req.body.colName,
  };
  let options = {
    uri: ps_core_server_url + '/api/training/unique_categories',
    method: 'POST',
    json: uniqueCatData,
  };
  request(options, function (error, response, body) {
    if (response.statusCode != 200) {
      logger.error('Can not find unique categories', { Date: date })
      res.status(400).send(body);
    } else {
      return res.send({ body });
    }
  });
};
// Api to calculate sampling percentagel
module.exports.calculateSampling = function (req, res) {
  var samplingPercentage = req.body;
  samplingPercentage.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.indexPath,
  });
  samplingPercentage.filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.filename,
  });
  // var afterEdaDataFile = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.afterEdaDataFilePath });
  // samplingPercentage.afterEdaDataFilePath = afterEdaDataFile;
  var options = {
    uri: ps_core_server_url + '/api/training/sampling_percentage',
    method: 'POST',
    json: samplingPercentage,
  };
  request(options, function (error, response, body) {
    if (response.statusCode != 200) {
      logger.error('Can not calculate sampling percentage', { Date: date })
      res.status(400).send(body);
      // reject(body)
    } else {
      return res.send({ data: body });
    }
  });
};

/**
 * Find single training
 * @param {*} req 
 * @param {*} res 
 */
exports.findOne = function (req, res) {
  res.send(req.trainingData);
};


/**
 * Delete a training and its related files
 * @param {*} req
 * @param {*} res
 */
exports.delete = function (req, res) {
  var trainingData = req.trainingData;
  var filesToBeDeleted = [];
  Models.find({ trainingId: trainingData._id }, function (err, models) {
    if (err) {
      logger.error('Could not find the models data for training: ' + trainingData._id, {
        error: err, Date: date
      });
    }
    models.forEach(function (model) {
      //Common files for training
      if (model.yDev)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.yDev,
          })
        );
      if (model.xDev)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.xDev,
          })
        );
      if (model.trainPipeFilePath)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.trainPipeFilePath,
          })
        );
      if (model.yTrain)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.yTrain,
          })
        );
      if (model.xTrain)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.xTrain,
          })
        );
      if (model.xHoldout)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.xHoldout,
          })
        );
      if (model.yHoldout)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.yHoldout,
          })
        );

      //Model file
      filesToBeDeleted.push(
        uploadUtil.costructAbsPath({
          baseDir: config.projectDir,
          projectId: trainingData.projectId,
          fileName: model.modelMetaData.modelPath,
        })
      );
      //yPred
      if (model.modelMetaData.yPred)
        filesToBeDeleted.push(
          uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: trainingData.projectId,
            fileName: model.modelMetaData.yPred,
          })
        );
      //holdOutFiles
      if (model.modelMetaData.hasOwnProperty('holdOutData')) {
        if (model.modelMetaData.holdOutData.yPred)
          filesToBeDeleted.push(
            uploadUtil.costructAbsPath({
              baseDir: config.projectDir,
              projectId: trainingData.projectId,
              fileName: model.modelMetaData.holdOutData.yPred,
            })
          );
      }
      //Scoring related files
      if (model.modelMetaData.hasOwnProperty('scoringMetrics')) {
        if (model.modelMetaData.scoringMetrics.yPred)
          filesToBeDeleted.push(
            uploadUtil.costructAbsPath({
              baseDir: config.projectDir,
              projectId: trainingData.projectId,
              fileName: model.modelMetaData.scoringMetrics.yPred,
            })
          );
        if (model.modelMetaData.scoringMetrics.yTestScoring)
          filesToBeDeleted.push(
            uploadUtil.costructAbsPath({
              baseDir: config.projectDir,
              projectId: trainingData.projectId,
              fileName: model.modelMetaData.scoringMetrics.yTestScoring,
            })
          );
        if (model.modelMetaData.scoringMetrics.xTestScoring)
          filesToBeDeleted.push(
            uploadUtil.costructAbsPath({
              baseDir: config.projectDir,
              projectId: trainingData.projectId,
              fileName: model.modelMetaData.scoringMetrics.xTestScoring,
            })
          );
      }
    });
    filesToBeDeleted = _.uniq(filesToBeDeleted);
  });

  //Delete database entry
  var training = Trainings.findByIdAndRemove(trainingData._id).exec();
  var models = Models.deleteOne({ trainingId: trainingData._id }).exec();
  Promise.all([training, models]).then(
    function (data) {
      //Once deleted from database remove the files from the project folder
      if (filesToBeDeleted.length) {
        coreUtil.deleteFiles(filesToBeDeleted, function (err) {
          if (err) {
            var log = {
              projectId: trainingData.projectId,
              userId: trainingData.createdBy,
              level: 'error',
              message: 'Could not delete the files related to training',
            };
            auditLogger.logit(log);
            logger.error('Could not delete the files related to training ' + trainingData._id, {
              error: err, Date: date
            });
            res.send({ message: 'Could not delete the files related to training', err: err });
          } else {
            var log = {
              projectId: trainingData.projectId,
              userId: trainingData.createdBy,
              level: 'info',
              message: 'Training data removed',
            };
            auditLogger.logit(log);
            logger.info('Training data removed for training id ' + trainingData._id, { Date: date });
            res.send({ message: 'Training data removed successfully.' });
          }
        });
      } else {
        logger.info('Training data removed for training id ' + trainingData._id, { Date: date });
        res.send({ message: 'Training data removed successfully.' });
      }
    },
    function (err) {
      var log = {
        projectId: req.project._id,
        userId: req.project.createdBy,
        level: 'error',
        message: 'Could not delete training data from database',
      };
      auditLogger.logit(log);
      logger.error('Could not delete training data from database for ' + trainingData._id, {
        error: err, Date: date
      });
      res.send({ message: 'Could not delete training data from database', err: err });
    }
  );
};

/**
 * Create Training Configuration
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  checkTrainingLimit(req, function (limitReached) {
    if (limitReached) {
      logger.error('Training limit reached', { Date: date });
      return res.status(400).send({ message: "Training limit reached!" });
    } else {
      //Filter boosting/bagging/gridSearchCv algos
      if (req.project.trainingCount > 1) {
        var filterdAlgos = [];
        req.body.algorithms.forEach(function (algorithm, idx) {
          algorithm && algorithm.split('-').length > 1 ? '' : filterdAlgos.push(algorithm);
        });
        req.body.algorithms = filterdAlgos;
      }

      var trainModelConf = req.body;
      trainModelConf.createdBy = req.user._id;
      trainModelConf.projectId = req.project._id;
      trainModelConf.fileEncoding = req.project.fileEncoding;
      // trainModelConf.filepath = path.resolve(req.project.filename);
      trainModelConf.filepath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: req.project.filename,
      });
      trainModelConf.name = 'Model : ' + req.project.name;
      trainModelConf.metaInfo = {
        fileName: req.body.rootFileName,
      };
      // trainModelConf.afterEdaDataFilePath = path.resolve(trainModelConf.afterEdaDataFilePath);
      trainModelConf.rootFileName = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.rootFileName,
      });
      trainModelConf.indexPath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.indexPath,
      });
      trainModelConf.parentPipelineFilename = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.parentPipelineFilename,
      });
      trainModelConf.noOfFeatures = trainModelConf.indepVariable.length;
      //File used in training
      trainModelConf.afterEdaFileId = req.body.parentFileId;
      //Used only for socket
      req.projectDetails = {
        createdBy: req.user._id,
        _id: req.project._id,
      };
      var trainModel = new Trainings(trainModelConf);
      trainModel.save(function (err, trainingData) {
        if (err) {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'error',
            message: 'Could not save trained model info',
          };
          auditLogger.logit(log);
          logger.error('Colud not save model info. ', { error: err, Date: date });
          if (res) res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        } else {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'info',
            message: 'Training started',
          };
          auditLogger.logit(log);
          trainModelConf.trainingId = trainingData._id;
          var options = {
            uri: ps_core_server_url + '/api/training/start',
            method: 'POST',
            json: trainModelConf,
          };
          request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var data = {
                trainingCount: req.project.trainingCount * 1 + 1,
              };
              updateProject(req.project._id, data).then(
                function (success) {
                  return res.send(body);
                },
                function () {
                  var log = {
                    projectId: req.project._id,
                    userId: req.project.createdBy,
                    level: 'error',
                    message: 'Could not update training count',
                  };
                  auditLogger.logit(log);
                  return res.send(body);
                }
              );
            } else {
              res.status(400).send(body);
            }
          });
        }
      });
    }
  });
};
//Function to update project info
function updateProject(projectId, data) {
  return ProjectConfig.updateOne(
    { _id: projectId },
    {
      $set: data,
    }
  ).exec();
}
/**
 * Create Timeseries Training Configuration
 * @param req
 * @param res
 */
exports.clusteringConfigCreate = function (req, res) {
  checkTrainingLimit(req, function (limitReached) {
    if (limitReached) {
      logger.error('Training limit reached', { Date: date })
      return res.status(400).send({ message: "Training limit reached!" });
    } else {
      //Filter boosting/bagging/gridSearchCv algos
      if (req.project.trainingCount > 1) {
        var filterdAlgos = [];
        req.body.algorithms.forEach(function (algorithm, idx) {
          algorithm.split('-').length > 1 ? '' : filterdAlgos.push(algorithm);
        });
        req.body.algorithms = filterdAlgos;
      }

      var trainModelConf = req.body;
      trainModelConf.createdBy = req.user._id;
      trainModelConf.projectId = req.project._id;
      trainModelConf.fileEncoding = req.project.fileEncoding;
      trainModelConf.indexPath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.indexPath,
      });
      trainModelConf.parentPipelineFilename = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.parentPipelineFilename,
      });
      trainModelConf.filepath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: req.project.filename,
      });
      trainModelConf.name = 'Model : ' + req.project.name;
      trainModelConf.metaInfo = {
        fileName: req.body.rootFileName,
      };
      trainModelConf.rootFileName = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.rootFileName,
      });
      //File used in training
      trainModelConf.afterEdaFileId = req.body.parentFileId;
      trainModelConf.noOfFeatures = trainModelConf.indepVariable.length;
      trainModelConf.afterEdaDataFilePath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.afterEdaDataFilePath,
      });
      req.projectDetails = {
        createdBy: req.user._id,
        _id: req.project._id,
      };
      var trainModel = new Trainings(trainModelConf);
      trainModel.save(function (err, trainingData) {
        if (err) {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'error',
            message: 'Could not save trained model info',
          };
          auditLogger.logit(log);
          logger.error('Colud not save model info. ', { error: err, Date: date });
          if (res) res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        } else {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'info',
            message: 'Training started',
          };
          auditLogger.logit(log);
          trainModelConf.trainingId = trainingData._id;
          var options = {
            uri: ps_core_server_url + '/api/clustering/training',
            method: 'POST',
            json: trainModelConf,
          };
          // trainModelConf.indepVariable = tempIndepVars;
          request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var data = {
                trainingCount: req.project.trainingCount * 1 + 1,
              };
              updateProject(req.project._id, data).then(
                function () {
                  res.send(body);
                },
                function () {
                  var log = {
                    projectId: req.project._id,
                    userId: req.project.createdBy,
                    level: 'error',
                    message: 'Could not update training count',
                  };
                  auditLogger.logit(log);
                  res.send(body);
                }
              );
            } else {
              res.status(400).send(body);
            }
          });
        }
      });
    }
  });
};

/**
 * Create Timeseries Training Configuration
 * @param req
 * @param res
 */
exports.timeserisConfigCreate = function (req, res) {
  checkTrainingLimit(req, function (limitReached) {
    if (limitReached) {
      return res.status(400).send({ message: "Training limit reached!" });
    } else {
      //Filter boosting/bagging/gridSearchCv algos
      if (req.project.trainingCount > 1) {
        var filterdAlgos = [];
        req.body.algorithms.forEach(function (algorithm, idx) {
          algorithm.split('-').length > 1 ? '' : filterdAlgos.push(algorithm);
        });
        req.body.algorithms = filterdAlgos;
      }

      var trainModelConf = req.body;
      trainModelConf.parentPipelineFilename = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.parentPipelineFilename,
      });
      trainModelConf.filename = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.rootFileName,
      });
      trainModelConf.preprocessedFilepath = req.body.preprocessedFilepath
        ? uploadUtil.costructAbsPath({
          baseDir: config.projectDir,
          projectId: req.project._id,
          fileName: req.body.preprocessedFilepath,
        })
        : null;
      trainModelConf.createdBy = req.user._id;
      trainModelConf.projectId = req.project._id;
      trainModelConf.fileEncoding = req.project.fileEncoding;
      // trainModelConf.filepath = path.resolve(req.project.filename);
      trainModelConf.indexPath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.indexPath,
      });

      trainModelConf.name = 'Model : ' + req.project.name;
      trainModelConf.metaInfo = {
        fileName: req.body.rootFileName,
      };
      // trainModelConf.afterEdaDataFilePath = path.resolve(trainModelConf.afterEdaDataFilePath);
      trainModelConf.afterEdaDataFilePath = uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: req.project._id,
        fileName: trainModelConf.afterEdaDataFilePath,
      });
      req.projectDetails = {
        createdBy: req.user._id,
        _id: req.project._id,
      };
      //File used in training
      trainModelConf.afterEdaFileId = req.body.parentFileId;
      var trainModel = new Trainings(trainModelConf);
      trainModel.save(function (err, trainingData) {
        if (err) {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'error',
            message: 'Could not save trained model info',
          };
          auditLogger.logit(log);
          logger.error('Colud not save model info. ', { error: err, Date: date });
          if (res) res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        } else {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'info',
            message: 'Training started',
          };
          auditLogger.logit(log);
          trainModelConf.trainingId = trainingData._id;
          var options = {
            uri: trainModelConf.isMultipleTimeseries ? ps_core_server_url + '/api/timeseries/multiple/training' : ps_core_server_url + '/api/timeseries/training',
            method: 'POST',
            json: trainModelConf,
          };
          // trainModelConf.indepVariable = tempIndepVars;
          request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var data = {
                trainingCount: req.project.trainingCount * 1 + 1,
              };
              updateProject(req.project._id, data).then(
                function () {
                  res.send(body);
                },
                function () {
                  var log = {
                    projectId: req.project._id,
                    userId: req.project.createdBy,
                    level: 'error',
                    message: 'Could not update training count',
                  };
                  auditLogger.logit(log);
                  res.send(body);
                }
              );
            } else {
              res.status(400).send(body);
            }
          });
        }
      });
    }
  });
};
/**
 * Model tuning
 * @param req
 * @param res
 */
exports.tuneModel = function (req, res) {
  var modelTuningData = {};
  modelTuningData = req.body;
  req.edaData.indexPath ? (modelTuningData.indexPath = req.edaData.indexPath) : '';
  var hptPref = req.body.hptPreference;
  var trainingData = req.trainingData;
  var modelData = req.modelData;
  if (trainingData.hptPreference) {
    var hptIndex = findHPTIndex(trainingData, hptPref.algoName);
    if (hptIndex > -1) {
      trainingData.hptPreference[hptIndex] = hptPref;
    } else {
      trainingData.hptPreference.push(hptPref);
    }
  }
  modelTuningData.filename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: trainingData.projectId,
    fileName: req.edaData.fileId.filename,
  });
  modelTuningData.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: trainingData.projectId,
    fileName: modelTuningData.indexPath,
  });
  modelTuningData.isMultilabel = req.edaData.isMultilabel;
  modelTuningData.modelFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: trainingData.projectId,
    fileName: modelData.modelMetaData.modelPath,
  });
  modelTuningData.modelTuningOption = modelTuningData.modelTuning || 'gridSearch';
  if (modelTuningData.modelTuning == 'hpt') {
    // Save hpt preference to bestparam object and use this to display last used params in UI.
    if (!modelData['modelMetaData'].hasOwnProperty('bestParams')) {
      modelData['modelMetaData'].bestParams = {};
    }
    modelData['modelMetaData'].bestParams['hpt'] = formatHptData(hptPref);
  }
  var hpt = trainingData.hptPreference ? trainingData.hptPreference : new Array(hptPref);
  modelTuningData.hptPreference = hpt;
  var api = null;
  if (req.body.projectType == 'predictive_modeling') {
    modelTuningData.modelData = {};
    modelTuningData.modelData.trainPipeFilePath = modelData.trainPipeFilePath
      ? uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: trainingData.projectId,
        fileName: modelData.trainPipeFilePath,
      })
      : null;
    modelTuningData.kFold = trainingData.kFold;
    modelTuningData.algoName = hptPref.algoName;
    modelTuningData.fileEncoding = trainingData.fileEncoding;
    modelTuningData.modelData.transformedDatasetPath = uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: trainingData.projectId,
      fileName: modelTuningData.transformedDatasetPath,
    });
    modelTuningData.isMultilabel = req.edaData.isMultilabel;
    modelTuningData.depVariable = req.edaData.depVariable;
    modelTuningData.classNames = req.edaData.classNames ? req.edaData.classNames : [];
    modelTuningData.predictiveModelingInfo = req.trainingData.predictiveModelingInfo;
    api = ps_core_server_url + '/api/model/tuning/start';
  } else if (req.body.projectType == 'timeseries') {
    modelTuningData.timeseriesInfo = trainingData.timeseriesInfo;
    modelTuningData.trainPipeFilePath = modelData.trainPipeFilePath
      ? uploadUtil.costructAbsPath({
        baseDir: config.projectDir,
        projectId: trainingData.projectId,
        fileName: modelData.trainPipeFilePath,
      })
      : null;
    modelTuningData.algorithms = [hptPref.algoName];
    modelTuningData.algoName = hptPref.algoName;
    modelTuningData.depVariable = req.edaData.depVariable;
    modelTuningData.projectId = req.body.pId;
    api = ps_core_server_url + '/api/timeseries/model_tuning';
  }
  modelTuningData.createdBy = req.user._id;
  //Update the new model in training algorithm array
  trainingData.algorithms.indexOf(hptPref.algoName) !== -1
    ? ''
    : trainingData.algorithms.push(hptPref.algoName);
  var params = {
    trainingId: trainingData._id,
    algorithms: trainingData.algorithms,
  };
  // updateTrainingData(params, function (resp) {

  // })
  var options = {
    uri: api,
    method: 'POST',
    json: modelTuningData,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send({ algorithms: params.algorithms });
    } else {
      res.status(400).send({ message: 'Could not start model tuning.' });
    }
  });
};
/**
 * Function to format hpt data, will return formatted data eg: [{name:'',data:''}]
 */
function formatHptData(hpt) {
  var result = [];
  if (hpt.hasOwnProperty('fields')) {
    var tempHpt = hpt.fields;
    hpt.fields.forEach(function (item) {
      result.push({ name: item.name, data: item.data });
    });
  }
  return result;
}
/**
 * Function to trigger advanced training for models
 */
exports.advTrainModel = function (req, res) {
  var advTrainData = {};
  advTrainData = req.body;
  var modelData = req.modelData;
  var trainingData = req.trainingData;
  req.edaData.indexPath ? (advTrainData.indexPath = req.edaData.indexPath) : '';

  advTrainData.trainingId = trainingData._id;
  advTrainData.modelId = modelData._id;
  advTrainData.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: modelData.projectId,
    fileName: advTrainData.indexPath,
  });
  advTrainData.transformedDatasetPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: modelData.projectId,
    fileName: advTrainData.transformedDatasetPath,
  });
  advTrainData.trainPipeFilePath =
    uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: modelData.projectId,
      fileName: modelData.trainPipeFilePath,
    }) || null;
  advTrainData.isMultilabel = req.edaData.isMultilabel;
  advTrainData.dataSetInfo = req.edaData.dataSetInfo;
  advTrainData.classNames = req.edaData.classNames;
  advTrainData.fileEncoding = trainingData.fileEncoding;
  advTrainData.projectId = trainingData.projectId;
  advTrainData.createdBy = req.user._id;
  advTrainData.validationStrategy = modelData.validationStrategy;
  advTrainData.predictiveModelingInfo = trainingData.predictiveModelingInfo;
  advTrainData.advAlgoOptions.modelFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: modelData.projectId,
    fileName: advTrainData.advAlgoOptions.modelFilePath,
  });
  if (advTrainData.advAlgoOptions.hyperParams) {
    advTrainData.advAlgoOptions.hyperParams.algoName = advTrainData.advAlgoOptions.algoname;
    advTrainData.hptPreference = [advTrainData.advAlgoOptions.hyperParams];
    delete advTrainData.advAlgoOptions.hyperParams;
  } else {
    advTrainData.hptPreference = null;
  }

  trainingData.algorithms.indexOf(advTrainData.advAlgoOptions.algoname) !== -1
    ? ''
    : trainingData.algorithms.push(advTrainData.advAlgoOptions.algoname);
  var params = {
    trainingId: trainingData._id,
    algorithms: trainingData.algorithms,
  };
  updateTrainingData(params, function (err, resp) {
    var options = {
      uri: ps_core_server_url + '/api/advAlgo/start',
      method: 'POST',
      json: advTrainData,
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send({ algorithms: params.algorithms });
        //res.send({status:"edaStarted"})
      }
    });
  });
};
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function updateTrainingData(data, callback) {
  Trainings.updateOne(
    { _id: data.trainingId },
    {
      $set: data,
    },
    function (err, affected, resp) {
      if (err) {
        callback({ message: err }, null);
      }
      callback(null, { status: true });
    }
  );
}
exports.updateTrainingData = updateTrainingData;
//Find the index of hpt preference
function findHPTIndex(trainingData, selectedAlgo) {
  var ind = -1;
  trainingData.hptPreference.forEach(function (data, i) {
    if (data.algoName == selectedAlgo) {
      ind = i;
      return;
    }
  });
  return ind;
}
/**
 * re train model
 * @param req
 * @param res
 */
exports.findReTrainModelData = function (req, res, next) {
  var modelDataId = req.trainingData.modelDataId;
  TrainedModelData.findById(modelDataId).exec(function (err, modelData) {
    if (err) {
      logger.error('Error while finding model data', { error: err, Date: date });
      return next(err);
    } else if (!modelData) {
      return res.status(404).send({ message: 'No model data with that identifier has been found' });
    }
    req.modelData = modelData;
    next();
  });
};
/**
 * Save model data such as xtrain,ytrain,xHoldout,yHoldout etc.
 * @param req
 * @param res
 */
exports.saveModelData = function (req, res, next) {
  if (req.body.projectStatus) {
    next();
  } else {
    if (req.isModelDataSaved) {
      next();
    } else {
      var body = req.body[0];
      var modelData = {};
      modelData.projectId = body.projectId;
      modelData.modelId = req.trainingData._id;
      modelData.createdBy = body.createdBy;
      modelData.dfAnalysisReport = body.dfAnalysisReport;
      modelData.exogVariables = body.exogVariables ? body.exogVariables : null;
      modelData.xHoldout = body.xHoldout;
      modelData.xTrain = body.xTrain;
      modelData.xTest = body.xTest;
      modelData.yHoldout = body.yHoldout;
      modelData.yPred = body.yPred;
      modelData.yTrain = body.yTrain;
      modelData.yLabelFilePath = body.yLabelFilePath;
      modelData.trainPipeFilePath = body.trainPipeFilePath;
      modelData.miscData = { afterEdaFilePath: body.afterEdaFilePath };
      modelData.featuresListFilePath = body.featuresListFilePath;
      modelData.xDev = body.xDev;
      modelData.yDev = body.yDev;
      modelData.xDevOriginal = body.xDevOriginal;
      modelData.xHoldoutOriginal = body.xHoldoutOriginal;

      var trainedModelData = new TrainedModelData(modelData);
      trainedModelData.save(function (err, savedModelData) {
        if (err) {
          var log = {
            projectId: req.project._id,
            userId: req.project.createdBy,
            level: 'error',
            message: 'Could not save model data',
          };
          auditLogger.logit(log);
          logger.error('Could not save model data', { error: err, Date: date });
        } else {
          req.modelDataId = savedModelData._id;
          next();
        }
      });
    }
  }
};

exports.isModelDataSaved = function (req, res, next) {
  if (req.body.projectStatus) {
    next();
  } else {
    TrainedModelData.find({ modelId: req.trainingData._id }).exec(function (err, doc) {
      if (err) {
        logger.error('Error has occured', { error: err, Date: date });
      }
      if (model.length) {
        req.modelDataId = doc[0]._id;
        req.isModelDataSaved = true;
        next();
      } else {
        req.isModelDataSaved = false;
        next();
      }
    });
  }
};
/*
    Function to update the project status
 */
function updateProjectStatus(req, res, projectStatus, callback) {
  var update = {};
  if (projectStatus == 'Model Failed') {
    var projectStatusDetails = [];
    var found = false;
    if (req.project.projectStatusDetails) {
      projectStatusDetails = req.project.projectStatusDetails;
      projectStatusDetails.forEach(function (projectStatus) {
        if (projectStatus.algoName == req.body.algoName) {
          found = true;
        }
      });
    }

    found ? '' : projectStatusDetails.push({ error: req.body.error, algoName: req.body.algoName });

    var failedModelsCount = projectStatusDetails ? projectStatusDetails.length : 0;
    var trainedModelCount = req.trainingData.modelMetaData
      ? req.trainingData.modelMetaData.length
      : 0;

    if (failedModelsCount == req.trainingData.algorithms.length) {
      update = {
        projectStatus: 'Model Failed',
        projectStatusDetails: projectStatusDetails,
      };
    } else if (failedModelsCount + trainedModelCount == req.trainingData.algorithms.length) {
      var trainingCount = req.project.trainingCount * 1 + 1;
      update = {
        projectStatus: 'Model Generated',
        trainingCount: trainingCount,
        projectStatusDetails: projectStatusDetails,
      };
    } else {
      update = {
        projectStatusDetails: projectStatusDetails,
      };
    }
  } else if (projectStatus == 'Model Generated') {
    var failedModelsCount = req.project.projectStatusDetails
      ? req.project.projectStatusDetails.length
      : 0;
    var trainedModelCount = req.trainingData.modelMetaData
      ? req.trainingData.modelMetaData.length
      : 0;
    if (failedModelsCount == req.trainingData.algorithms.length) {
      update = {
        projectStatus: 'Model Failed',
      };
    } else if (failedModelsCount + trainedModelCount == req.trainingData.algorithms.length) {
      var trainingCount = req.project.trainingCount * 1 + 1;
      update = {
        projectStatus: projectStatus,
        trainingCount: trainingCount,
      };
    } else {
      update = {
        projectStatus: projectStatus,
      };
    }
  } else if (projectStatus == 'Training Started') {
    var projectStatusDetails = [];
    update = {
      projectStatus: projectStatus,
      projectStatusDetails: projectStatusDetails,
    };
  } else {
    update = {
      projectStatus: projectStatus,
    };
  }
  ProjectConfig.updateOne(
    { _id: req.project._id },
    {
      $set: update,
    },
    function (err, affected, resp) {
      if (err) {
        var log = {
          projectId: req.project._id,
          userId: req.project.createdBy,
          level: 'error',
          message: 'Could not update project Configuration',
        };
        auditLogger.logit(log);
        callback({ message: 'Could not update project Configuration' }, null);
        // res.status(400).send({ message: "Could not update project Configuration" });
      }
      // socket.emit("TrainingProgress", { projectStatus: projectStatus, algoName: req.body.algoName }, req.projectDetails);
      req.project.projectStatus = projectStatus;
      var log = {
        projectId: req.project._id,
        userId: req.project.createdBy,
        level: 'info',
        message: 'Updating project status',
      };
      auditLogger.logit(log);
      callback(null, req.project);
      // res.send(req.project);
    }
  );
}

/**
 * Function to trigger calculation of correlation
 */
exports.calculateCorrelation = function (req, res) {
  var correlationObj = req.body;
  correlationObj.createdBy = req.user._id;
  correlationObj.projectId = req.project._id;
  correlationObj.fileEncoding = req.project.fileEncoding;
  // correlationObj.afterEdaDataFilePath = path.resolve(correlationObj.afterEdaDataFilePath);
  correlationObj.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: correlationObj.afterEdaDataFilePath,
  });

  //Configuration for calling ps core API
  var options = {
    uri: ps_core_server_url + '/api/training/hypothesisTesting/start',
    method: 'POST',
    json: correlationObj,
  };
  //Save to audit log
  var log = {
    projectId: req.project._id,
    userId: req.user._id,
    level: 'info',
    message: 'Get correlation details',
  };
  auditLogger.logit(log);
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //res.send({status:"edaStarted"})
    }
  });
  res.send({ status: 'Correlation started' });
};
/**
 * Function to receive correlation result and send it to client
 */
exports.calculatedCorrelation = function (req, res) {
  var correlationData = req.body;
  if (req.query.status == 'error') {
    res.status(400).send({ message: 'Oops!, hypothisis testing failed.' });
  }
  socket.emit('hypothisisTest', correlationData, req.project);
  res.send({ message: 'Received' });
};

/**
 * List all trainings
 * @param req
 * @param res
 */
exports.list = function (req, res) {
  // EdaConfig.find({ projectId: req.project._id }).sort({ 'createdAt': -1 }).limit(1).exec(function (err, project) {
  //     if (err) {
  //         //logger.error("Could not find Strain configurations", {error: err});
  //         res.status(400).send({ message: "Could not find project" });
  //     } else {
  //         res.json(project);
  //     }
  // })
  trainModel = Trainings.find({ projectId: req.project._id })
    .sort({ createdAt: -1 })
    .limit(1)
    .populate('edaId');
  trainModel.exec(function (err, models) {
    var log = {};
    if (err) {
      log = {
        projectId: req.project._id,
        userId: req.project.createdBy,
        level: 'error',
        message: 'Could not find models',
      };
      auditLogger.logit(log);
      logger.error('Could not find models', { error: err, Date: date });
      res.status(400).send({ message: 'Could not find models' });
    } else {
      log = {
        projectId: req.project._id,
        userId: req.project.createdBy,
        level: 'info',
        message: 'Listing models',
      };
      auditLogger.logit(log);
      res.json(models);
    }
  });
};
/*
 * Function will be called once the model training is done
 */
exports.trainingDone = function (req, res) {
  //console.log(req.body);
  var data = req.body;
  var models = new Models(data);
  var projectDetails = {
    createdBy: req.body[0] ? req.body[0].createdBy : req.project.createdBy,
    _id: req.project._id,
  };
  if (data.status == 'training_failed') {
    var training = req.trainingData;
    training.status = data.status;
    training.deleteOne(function (err, doc) {
      if (err) {
        logger.error('Training failed, could not update the status', { error: err, Date: date })
        return res
          .status(400)
          .send({ message: 'Training failed, could not update the status', err: err });
      }
      socket.emit(
        'TrainingProgress',
        {
          algoName: req.body.algoName,
          status: data.status,
          message: data.message,
          modelMetaData: doc,
          trainingType: data.trainingType,
        },
        projectDetails
      );
      res.send(doc);
    });
  } else {
    models.save(async function (err, doc) {
      // console.log(doc);
      if (err) {
        //   console.log(err);
        res.status(400).send({ message: 'Could not save the data', err: err });
      }
      if (doc.status === 'success' && (doc.modelMetaData.algoName === 'Random Forest' || doc.modelMetaData.algoName === 'Linear Regression Ts')) {
        // console.log("************************tyyyy", doc);
        await createTimeseriesGroup(req.body, doc)
      }
      socket.emit(
        'TrainingProgress',
        {
          algoName: req.body.algoName,
          status: data.status,
          modelMetaData: doc,
          trainingType: data.trainingType,
          message: data.message,
        },
        projectDetails
      );
      res.send(doc);
    });
  }
};

async function createTimeseriesGroup(req, doc) {
  // console.log("m called********", req, doc)
  try {
    let tsdata = {
      modelId: doc._id,
      allowedGroupList: req.allowedGroupList,
      rejectedGroupList: req.rejectedGroupList,
      projectId: req.projectId,
      createdBy: req.createdBy
    }
    var eda = new timseriesGroup(tsdata);
    eda.save(async function (err, edaDoc) {
      if (err) {
        logger.error("Could not save timeseries group list" + 'projectId: ' + req.projectId, { error: err, Date: date });
        return;
      } else {
        logger.info("Created timeseries group list" + 'projectId: ' + req.projectId, { Date: date });
      }
    });
  } catch (error) {
    logger.error("Could not save timeseries group list" + 'projectId: ' + req.projectId, { error: error, Date: date });
    console.error({ message: 'Could not save timeseries group list.' });
  }
}
/*
 * Function will be called once the model training is done
 */
exports.trainingDoneB = function (req, res) {
  var update = {};
  // console.log('*********************', req.body);
  //this is used for socket
  req.projectDetails = {
    createdBy: req.body[0] ? req.body[0].createdBy : req.project.createdBy,
    _id: req.project._id,
  };
  if (req.body.projectStatus) {
    var projectStatus = req.body.projectStatus;
    updateProjectStatus(req, res, projectStatus, function (err, project) {
      if (err) {
        res.status(400).send(err);
      }
      socket.emit(
        'TrainingProgress',
        { error: req.body.error, projectStatus: projectStatus, algoName: req.body.algoName },
        req.projectDetails
      );
      res.send(project);
    });
  } else {
    if (req.body.tuningStatus == 'tuning_failed') {
      //socket.emit("modelTuningProgress", { error:'tuning_failed',algoName:req.body.algoName }, req.project);
      if (req.trainingData.modelMetaData) {
        req.trainingData.modelMetaData.forEach(function (data, i) {
          if (data[0].algoName == req.body.algoName) {
            data[0].status = 'tuning_failed';
          }
        });
      }
      var update = {
        modelMetaData: req.trainingData.modelMetaData,
      };
      Trainings.updateOne(
        { _id: req.trainingData._id },
        {
          $set: update,
        },
        function (err, affected, resp) {
          return res.send({ message: 'data saved' });
        }
      );
      socket.emit(
        'modelTuningProgress',
        {
          error: 'tuning_failed',
          hptPreference: req.trainingData.hptPreference,
          modelMetaData: req.trainingData.modelMetaData,
          algoName: req.body.algoName,
        },
        req.project
      );
    } else {
      var modelMetadata = req.body[0].modelMetaData;
      var fileEncoding = req.body[0].fileEncoding;
      var classNames = req.body[0].classNames ? req.body[0].classNames : [];
      var scalerObj = req.body[0].scalerObj;
      var normalizationObj = req.body[0].normalizationObj;
      var decompositionObj = req.body[0].decompositionObj;
      var predictiveModelingInfo = req.body[0].predictiveModelingInfo;
      var trainedModelData;
      if (req.trainingData.modelMetaData) {
        trainedModelData = req.trainingData.modelMetaData;
        if (req.query.type == 'model_tuning') {
          //if it is model tuning update the model metadata for that particular model
          var bestParams = null;
          trainedModelData.forEach(function (data, i) {
            if (data[0].algoName == modelMetadata[0].algoName) {
              modelMetadata[0].status = 'tuning_done';
              // modelMetadata[0].timeElapsed = req.body[0].timeElapsed;
              var temp = modelMetadata[0].bestParams;
              if (data[0].hasOwnProperty('bestParams') && data[0].bestParams) {
                Object.assign(data[0].bestParams, temp);
                modelMetadata[0].bestParams = data[0].bestParams;
              }
              data[0] = modelMetadata[0];
            }
          });
          update = {
            modelMetaData: trainedModelData,
          };
        } else {
          //if it is training just push the new data to the existing data
          // modelMetadata[0].timeElapsed = req.body[0].timeElapsed;
          trainedModelData.push(modelMetadata);
          update = {
            classNames: classNames,
            fileEncoding: fileEncoding,
            modelDataId: req.modelDataId,
            modelMetaData: trainedModelData,
          };
        }
      } else {
        //For the first time during model generation
        //modelMetadata[0].timeElapsed = req.body[0].timeElapsed;
        trainedModelData = [modelMetadata];
        update = {
          predictiveModelingInfo: predictiveModelingInfo,
          scalerObj: scalerObj,
          normalizationObj: normalizationObj,
          decompositionObj: decompositionObj,
          classNames: classNames,
          modelDataId: req.modelDataId,
          modelMetaData: trainedModelData,
        };
      }
      Trainings.updateOne(
        { _id: req.trainingData._id },
        {
          $set: update,
        },
        function (err, affected, resp) {
          if (err) {
            var log = {
              projectId: req.project._id,
              userId: req.body[0].createdBy,
              level: 'error',
              message: 'Could not update model data',
            };
            auditLogger.logit(log);
            res.status(400).send({ message: 'Could not update model data' });
          }
          var log = {
            projectId: req.project._id,
            userId: req.body[0].createdBy,
            level: 'info',
            message: 'Updating model data',
          };
          auditLogger.logit(log);
          req.trainingData.modelMetaData = trainedModelData;
          var projectStatus = 'Model Generated';
          updateProjectStatus(req, res, projectStatus, function (err, project) {
            if (err) {
              res.status(400).send(err);
            }
            if (req.query.type == 'model_tuning') {
              socket.emit(
                'modelTuningProgress',
                {
                  hptPreference: req.trainingData.hptPreference,
                  modelMetaData: trainedModelData,
                  algoName: modelMetadata[0].algoName,
                },
                req.projectDetails
              );
            } else {
              socket.emit(
                'TrainingProgress',
                {
                  projectStatus: project.projectStatus,
                  algoName: req.body.algoName,
                  hptPreference: req.trainingData.hptPreference,
                  modelMetaData: trainedModelData,
                },
                req.projectDetails
              );
            }
            res.send(project);
          });
        }
      );
    }
  }
};
/**
 * Function requesting to generate eda graph from ps core
 */
exports.getCorrelationGraphData = function (req, res) {
  var projectDetails = req.body;
  projectDetails.createdBy = req.user._id;
  projectDetails.projectId = req.project._id;
  projectDetails.fileEncoding = req.project.fileEncoding;
  // projectDetails.afterEdaDataFilePath = path.resolve(req.body.afterEdaDataFilePath);
  projectDetails.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.afterEdaDataFilePath,
  });
  var problemType = req.query.problemType;
  var options = {
    uri: ps_core_server_url + '/api/train/scatter',
    method: 'POST',
    json: projectDetails,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (problemType == 'ML') {
        res.send(body[0].htmlContent);
      } else {
        res.send(body);
      }
    } else {
      res.status(400).send(body);
    }
  });
};
exports.getMultiVariateUnivariateAnalysis = function (req, res) {
  var projectDetails = req.body;
  projectDetails.createdBy = req.user._id;
  projectDetails.projectId = req.project._id;
  // projectDetails.fileEncoding = req.project.fileEncoding;
  // projectDetails.originalFilePath ? projectDetails.originalFilePath = path.resolve(projectDetails.originalFilePath): null;
  projectDetails.filename
    ? (projectDetails.filename = uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: req.project._id,
      fileName: projectDetails.filename,
    }))
    : null;
  projectDetails.currentPipelineFilename
    ? (projectDetails.currentPipelineFilename = uploadUtil.costructAbsPath({
      baseDir: config.projectDir,
      projectId: req.project._id,
      fileName: projectDetails.currentPipelineFilename,
    }))
    : null;
  //projectDetails.afterEdaDataFilePath ? projectDetails.afterEdaDataFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: projectDetails.afterEdaDataFilePath }) : null;
  projectDetails.projectType = req.project.type;
  var target = req.query.target ? true : false;
  var options = {
    uri: ps_core_server_url + '/api/trainmodel/multivariate_analysis?target=' + target,
    method: 'POST',
    json: projectDetails,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      logger.error('Could not get target plot', { Date: date })
      res.status(400).send(body);
    }
  });
  //res.send()
};
exports.doTimeseriesPreProcess = function (req, res) {
  var preProcessData = req.body;
  // preProcessData.afterEdaDataFilePath = path.resolve(req.body.afterEdaDataFilePath);
  preProcessData.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.afterEdaDataFilePath,
  });
  preProcessData.fileExtension = path.extname(req.body.afterEdaDataFilePath);
  preProcessData.projectId = req.project._id;
  var options = {
    uri: ps_core_server_url + '/api/timeseries/preprocessing',
    method: 'POST',
    json: preProcessData,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(400).send(body);
    }
  });
};
//Function for generating graphs for timeseries
exports.doTimeseriesGraphAnalysis = function (req, res) {
  var graphAnalysisData = req.body;
  // graphAnalysisData.preprocessedFilepath = path.resolve(req.body.preprocessedFilepath);
  graphAnalysisData.preprocessedFilepath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.preprocessedFilepath,
  });
  graphAnalysisData.projectId = req.project._id;
  var options = {
    uri: ps_core_server_url + '/api/timeseries/graphanalysis',
    method: 'POST',
    json: graphAnalysisData,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(400).send(body);
    }
  });
};
//Function to trigger a pscore api to get the details like algotype,isMultilabel,testPercentage,isImbalanced etc. details
exports.getTargetDetails = function (req, res) {
  var data = req.body;
  data.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: data.afterEdaDataFilePath,
  });
  var options = {
    uri: ps_core_server_url + '/api/training/target_response',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(400).send(body);
    }
  });
};
exports.calculateFeatureScore = function (req, res) {
  var data = req.body;
  data.createdBy = req.user._id;
  data.projectId = req.project._id;
  data.fileEncoding = req.project.fileEncoding;
  data.indexPath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.indexPath,
  });
  data.rootFileName = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: req.body.rootFileName,
  });
  data.afterEdaDataFilePath = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: data.afterEdaDataFilePath,
  });
  data.parentPipelineFilename = uploadUtil.costructAbsPath({
    baseDir: config.projectDir,
    projectId: req.project._id,
    fileName: data.parentPipelineFilename,
  });
  data.noOfFeatures = data.indepVariable.length;
  var options = {
    uri: ps_core_server_url + '/api/training/feature_selection',
    method: 'POST',
    json: data,
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(400).send(body);
    }
  });
};
/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.projectById = function (req, res, next, id) {
  ProjectConfig.findById(id).exec(function (err, project) {
    if (err) {
      logger.error('Error while finding project configuration', { error: err, Date: date });
      return next(err);
    } else if (!project) {
      return res
        .status(404)
        .send({ message: 'No project Configuration with that identifier has been found' });
    }
    req.project = project;
    next();
  });
};

/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.trainingById = function (req, res, next, id) {
  Trainings.findById(id)
    .populate('edaId')
    .exec(function (err, trainingData) {
      if (err) {
        logger.error('Error while finding model configuration', { error: err, Date: date });
        return next(err);
      } else if (!trainingData) {
        return res
          .status(400)
          .send({ message: 'No model configuration with that identifier has been found' });
      }
      req.trainingData = trainingData;
      next();
    });
};

exports.findById = findById;
function findById(id, callback) {
  ProjectConfig.findById(id).exec(function (err, project) {
    if (err) {
      logger.error('Error while finding Project configuration', { error: err, Date: date });
      return callback(null);
    } else if (!project) {
      return callback(null);
    }
    callback(project);
  });
}
