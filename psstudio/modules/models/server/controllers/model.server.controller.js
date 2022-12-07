/**
 * Created by vishnu on 17/10/17.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
    mongoose = require('mongoose'),
    ProjectConfig = mongoose.model('projectConfig'),
    Trainings = mongoose.model('trainings'),
    Models = mongoose.model('models'),
    Eda = mongoose.model('eda'),
    Usecase = mongoose.model('Usecase'),
    PredictionResultModel = mongoose.model('predictionResultModel'),
    Deployment = mongoose.model('deployment'),
    TaExperiments = mongoose.model('taexperiments'),
    timseriesGroup = mongoose.model('tsGroup'),
    multer = require('multer'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    config = require("../../../../config/config"),
    csv = require('fast-csv'),
    fs = require('fs'),
    xlsx = require('xlsx');
var osChecker = require("../../../../utils/general/oschecker.utils.server");
var socket = require("../../../../utils/socket/core.socket.utils");
var request = require('request');
var _ = require('lodash');
var archiver = require('archiver');
var destination = './projects/';
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var coreUtil = require('../../../../utils/system/core.system.utils');
var filesList = require('../../../data/server/controllers/data.server.controller');
const basicSubscription = require('../../../../config/env/plans/basic-subscription');
const proSubscription = require('../../../../config/env/plans/pro-subscription');
const handlebars = require('handlebars');
var date = Date(Date.now());
date = date.toString();
if (osChecker.checkOs() == "windows") {
    destination = '.\\projects\\';
} else {
    destination = './projects/';
}
/**
 * Function to trigger holdout api
 */
module.exports.doHoldout = function (req, res) {
    var holdOutData = req.body;
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    if (holdOutData.hasOwnProperty('reTrainFileId')) {
        holdOutData.trainPipeFilePath = req.modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.fileData['reTrainingData']['trainPipeFilePath'] }) : null;
        holdOutData.xHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.fileData['reTrainingData']['xHoldout'] });
        holdOutData.yHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.fileData['reTrainingData']['yHoldout'] });

    } else {
        holdOutData.trainPipeFilePath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.trainPipeFilePath }) : null;
        holdOutData.xHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.xHoldout });
        holdOutData.yHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.yHoldout });

    }

    holdOutData.projectId = trainingData.projectId;
    holdOutData.isMultilabel = trainingData.isMultilabel;
    holdOutData.indepVariable = trainingData.indepVariable;
    holdOutData.depVariable = trainingData.depVariable;
    holdOutData.classNames = trainingData.classNames || [];
    holdOutData.dfAnalysisReport = modelData.dfAnalysisReport ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.dfAnalysisReport }) : null;
    holdOutData.modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.body.modelFilePath });
    var options = {
        uri: ps_core_server_url + '/api/model/holdout',
        method: 'POST',
        json: holdOutData
    };
    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var respData = response.body;
            //Set holdout data
            modelData.modelMetaData.holdOutData = respData.data;
            //Mark the fild as modified
            modelData.markModified('modelMetaData');
            //Save the doc
            modelData.save(function (err, doc) {
                if (err) {
                    logger.error('Could not update the model' + err, { Date: date })
                    res.status(400).send({ message: 'Could not update the model' });
                }
                res.send(doc);
            });
        } else {
            res.status(400).send(response.body)
        }
    });

}
/**
 * Function to trigger scoring api
 */
module.exports.doScoring = function (req, res) {
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    if (!trainingData.scoringDataFilePath) {
        logger.error('Please upload scoring dataset and try', { Date: date })
        return res.status(400).send({ message: 'Please upload scoring dataset and try!' })
    }
    var scoringData = req.body;
    if (scoringData.hasOwnProperty('reTrainFileId')) {
        scoringData.trainPipeFilePath = req.fileData['reTrainingData']['trainPipeFilePath'] ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.fileData['reTrainingData']['trainPipeFilePath'] }) : null;
    } else {
        scoringData.trainPipeFilePath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.trainPipeFilePath }) : null;
    }
    scoringData.classNames = req.edaData.classNames || null;
    scoringData.projectId = trainingData.projectId;
    scoringData.depVariable = req.edaData.depVariable;
    scoringData.fileEncoding = trainingData.scoringfileEncoding;
    scoringData.scoringDataFilePath = trainingData.scoringDataFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: trainingData.scoringDataFilePath }) : null;
    scoringData.indepVariable = trainingData.indepVariable;
    scoringData.isMultilabel = req.edaData.isMultilabel;
    scoringData.edaSummary = req.edaData.edaSummary;
    scoringData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.transformedDatasetPath });
    scoringData.modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelFilePath });
    // setting the allowed no of rows and cols value to data for restriction - only for saas.
    // -1 is for enterprise and super_admin - no restriction for rows and cols.
    scoringData.noOfRowsAllowed = -1;
    scoringData.noOfColsAllowed = -1;
    if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
        let userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
        let data = null;
        Plans.findOne({ planType: userPlanType }, function (err, planTemplateData) {
            if (err) {
                logger.error('Can not add new Plan to the plans collection', { Date: date })
                return res.status(400).send(err.message);
            }
            data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'model');
            data.rules.find(item => {
                if (item.name === 'numberofrowsallowedforscoring') {
                    scoringData.noOfRowsAllowed = item.allowedValues;
                }
                if (item.name === 'numberofcolumnsallowedforscoring') {
                    scoringData.noOfColsAllowed = item.allowedValues;
                }
            });
        });
        // if (userPlanType === "pro") {
        //     scoringData.noOfRowsAllowed = proSubscription.model.scoring.noOfRowsPermitForPro;
        //     scoringData.noOfColsAllowed = proSubscription.model.scoring.noOfColsPermitForPro;
        // } else if (userPlanType === "basic") {
        //     scoringData.noOfRowsAllowed = basicSubscription.model.scoring.noOfRowsPermitForBasic;
        //     scoringData.noOfColsAllowed = basicSubscription.model.scoring.noOfColsPermitForBasic;
        // }
    }
    var options = {
        uri: ps_core_server_url + '/api/model/scoring',
        method: 'POST',
        json: scoringData
    };
    request(options, function (error, response, body) {
        // If everthing ges well response will come in html format, you can bind this html in angularjs
        if (!error && response.statusCode == 200) {
            var respData = response.body;
            //Set holdout data
            modelData.modelMetaData.scoringMetrics = respData.scoringMetrics;
            //Mark the fild as modified
            modelData.markModified('modelMetaData');
            //Save the doc
            modelData.save(function (err, doc) {
                if (err) {
                    logger.info('Scoring can not be calculated' + err, { Date: date });
                    res.status(400).send({ message: 'Could not update the model' });
                }
                res.send(doc);
            });
        } else {
            res.status(400).send(response.body)
        }
    });
}
/**
 * Function to upload scoring data set
 */
exports.uploadScoringData = function (req, res) {
    req.projectId = req.trainingData.projectId;
    uploadUtil.upload(req, res, function (err) {
        if (err) {
            return res.end(err);
        }
        req.trainingData['scoringfileEncoding'] = req.query.fileEncoding;
        req.trainingData['scoringDataFilePath'] = req.file.filename;
        req.trainingData.save(function (err, doc) {
            if (err) {
                logger.error('Could not save scoring data' + err, { Date: date });
                return res.status(400).send({ message: 'Failed to save data' })
            }
            res.send(doc);
        })

    });
}
/**
 * Function to generate analysis report graph
 */
exports.analysisReport = function (req, res) {
    var projectDetails = req.body;
    projectDetails.createdBy = req.user._id;
    projectDetails.projectId = req.project._id;
    projectDetails.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.body.indexPath });
    projectDetails.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.body.transformedDatasetPath })
    // var fpath = req.body.arFilePath ? path.resolve(pathGenerator({projectId:req.project._id,fileName:req.body.arFilePath})):null;
    var fpath = req.body.arFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.body.arFilePath }) : null;
    projectDetails.arFilePath = fpath;
    //projectDetails.analysisReport = req.body.analysisReport;
    // Graph generation request send to pscore
    var options = {
        uri: ps_core_server_url + '/api/models/analysisReport/graph',
        method: 'POST',
        json: projectDetails
    };
    request(options, function (error, response, body) {
        // If everthing ges well response will come in html format, you can bind this html in angularjs
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Could not generate analysis report' + error, { Date: date });
            res.status(400).send(body);
        }
    });
};
/**
 * Function will generate data for analysis report table
 */
exports.analysisReportJson = function (req, res) {
    var algoName = req.body.algoName;
    var inputParams = {};
    inputParams.algoType = req.body.algoType;
    if (req.body.algoType !== 'clustering') {
        inputParams.depVariable = req.edaData.depVariable;
    }
    inputParams.classNames = req.edaData.classNames;
    inputParams.edaSummary = req.edaData.edaSummary;
    inputParams.isMultilabel = req.edaData.isMultilabel;
    inputParams.nSteps = req.trainingData.nSteps;
    inputParams.timeseriesIds = req.edaData.timeseriesIds;
    inputParams.allowedGroupList = req.body.allowedGroupList;
    inputParams.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.edaData.indexPath });
    inputParams.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.edaData.fileId.filename });
    inputParams.projectId = req.trainingData.projectId;
    inputParams.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.transformedDatasetPath });
    if (algoName) {
        inputParams.algoName = algoName;
        inputParams.projectType = req.body.projectType;
        if (req.body.algoType == 'timeseries') {
            inputParams.timeseriesInfo = req.trainingData['timeseriesInfo'] || null;
            inputParams.trainPipeFilePath = req.modelData.modelMetaData.modelPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.trainPipeFilePath }) : '';
            inputParams.modelPath = req.modelData.modelMetaData.modelPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath }) : '';
        } else {
            inputParams.algorithms = [algoName];
            inputParams.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.trainPipeFilePath }) || null;
            inputParams.tab = req.body.tab;
            inputParams.indepVariable = req.trainingData.indepVariable;
            inputParams.logTransformationColumns = req.trainingData.logTransformationColumns;
            inputParams.scalarValue = req.trainingData.scalarValue;
            inputParams.modelFilePath = req.modelData.modelMetaData.modelPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath }) : '';
            inputParams.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath });
            if (req.body.tab == 'development') {

            } else if (req.body.tab == 'scoring') {
                inputParams.fileEncoding = req.trainingData.scoringfileEncoding
                inputParams.scoringDataFilePath = req.trainingData.scoringDataFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.trainingData.scoringDataFilePath }) : null;
                inputParams.transformedScoringPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.modelData.modelMetaData.scoringMetrics.transformedScoringPath });
            } else {
                //Holdout

            }
        }
        // request will send to pscore for generating analysis report data
        var options = {
            uri: ps_core_server_url + '/api/models/analysisReport/report',
            method: 'POST',
            json: inputParams
        };
        request(options, function (error, response, body) {
            //  pscore will send analysis report filepath as response, we need to read and construct data in required format
            if (!error && response.statusCode == 200) {
                if (!body.arFilePath) {
                    logger.error('Could not generate analysis report' + error, { Date: date });
                    return res.status(400).send({ message: "Could not load analysis report" });
                }
                var arFileName = body.arFilePath;
                // var filePath = path.resolve(body.arFilePath);
                var filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: body.arFilePath });
                // readCsvData(filePath,function(err,data){
                //     res.send(data);
                // })
                var data = {
                    filePath: filePath,
                    fileExtension: path.extname(body.arFilePath),
                    fileEncoding: body['fileEncoding'] || 'utf_8',
                    numRows: req.query.numRows || 20
                }

                var options = {
                    uri: ps_core_server_url + '/api/data/get_preview',
                    method: 'POST',
                    json: data
                };
                request(options, function (error, response, body) {
                    if (response.statusCode != 200) {
                        logger.error('Could not generate analysis report' + error, { Date: date });
                        res.status(400).json(response.body)
                    } else {
                        var data = response.body;
                        data.arFileName = arFileName;
                        res.json(data)
                    }
                });
            } else {
                res.status(400).send(body);
            }
        });
    } else {
        res.status(400).send({ message: "Algorithm name is required" });
    }
};

function readCsvData(filePath, callback) {
    var workbook = xlsx.readFile(filePath, { sheetRows: 20, cellDates: true });
    var sheetsList = workbook.SheetNames;
    sheetsList.forEach(function (y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for (var z in worksheet) {
            if (z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            }
            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names
            if (row == 1 && value) {
                headers[col] = value;
                continue;
            }

            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        callback(null, { "arData": data, arFileName: path.basename(filePath) });
    });
}
/**
 * List all trainings
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    var project = req.project;
    var trainModel = null;
    if (req.query.isEdaRequired) {
        trainModel = Trainings.find({ projectId: req.project._id }).sort({ 'createdAt': -1 }).limit(1).populate('edaId');
    } else {
        trainModel = Trainings.find({ projectId: req.project._id }).sort({ 'createdAt': -1 }).limit(1);
    }
    trainModel.exec(function (err, models) {
        var log = {};
        if (err) {
            log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "error",
                message: "Could not find models"
            };
            auditLogger.logit(log);
            logger.error("Could not find models", { error: err, Date: date });
            res.status(400).send({ message: "Could not find models" });
        } else {
            log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "info",
                message: "Listing models"
            };
            auditLogger.logit(log);
            models.forEach(function (data, i) {
                if (!data.modelMetaData) {
                    models.splice(i, 1);
                }
            });
            res.json(models);
        }
    });
    //res.json(models)
};
/**
 * List trainings
 * @param req
 * @param res
 */
exports.getTrainingList = function (req, res) {
    Trainings.find({ projectId: req.project._id }).populate('edaId').sort({ 'createdAt': -1 }).exec(function (err, trainings) {
        var log = {};
        if (err) {
            log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "error",
                message: "Could not find training data"
            };
            auditLogger.logit(log);
            logger.error("Could not find training data", { error: err, Date: date });
            res.status(400).send({ message: "Could not find training data" });
        } else {
            log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "info",
                message: "Listing trainings"
            };
            auditLogger.logit(log);
            // trainings.forEach(function(data,i){
            //     if(!data.modelMetaData){
            //         trainings.splice(i, 1);
            //     }
            // });
            res.send(trainings);
        }
    });
};
/**
 * Get list of models by training Id
 */
exports.getModels = function (req, res) {
    findByTrainingId(req.trainingData._id, function (err, docs) {
        if (err) {
            logger.error('Could not fetch the models', { error: err, Date: date });
            res.status(400).send({ message: 'Could not fetch the models', err: err })
        }
        res.send(docs);
    })
}
/**
 * Function to download the model.
 * @param req
 * @param res
 */
exports.download = function (req, res) {
    var algoName = req.query.ag;
    var log = {
        projectId: req.trainingData.projectId,
        userId: req.trainingData.createdBy,
        level: "info",
        message: "Downloading model"
    };
    auditLogger.logit(log);
    req.trainingData.modelMetaData.forEach(function (data) {
        if (data[0].algoName == algoName) {
            var file = data[0].modelPath;
            res.download(file);
        }
    });
};
/**
 * Function to generate and download toolkit
 */
exports.downloadToolkit = function (req, res) {
    var modelFilePath, forecastModelPath, forecastmodelName, originalTrainingFile, tokenFileName, tokenFilePath, preprocessedFilepath, operationFilePath, operationFileName, apifile, ui_template = null, xTest = null, yLabelFilePath = null, trainPipeFilePath = null, readme, requiremets, polynomialDegree = 2;
    var algoName = req.query.ag;
    var algoType = req.query.algoType;
    var platform = req.query.pf.toLowerCase();
    var projectType = req.query.projectType;
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    var notebooks = req.query.notebooks ? req.query.notebooks.split(',') : null;
    var indexPath;
    if (req.query.psType != 'pslite') {
        //Original training filepath    
        originalTrainingFile = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.fileData.filename });
    }
    xTest = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.xTest });
    trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.trainPipeFilePath });
    if (platform == "windows") {
        operationFileName = "operation.cp37-win32.pyd";
        tokenFileName = "ps_token.cp37-win32.pyd";

    } else if (platform == "ubuntu") {
        operationFileName = "operation.cpython-37m-x86_64-linux-gnu.so";
        tokenFileName = "ps_token.cpython-37m-x86_64-linux-gnu.so";
    } else if (platform == "docker") {
        operationFileName = "operation.cpython-37m-x86_64-linux-gnu.so";
        tokenFileName = "ps_token.cpython-37m-x86_64-linux-gnu.so";
    } else if (platform == "multi-model") {

    } else {
        return res.status(400).send({ message: "Could not find package for the specified platform" });
    }
    if (algoType == 'timeseries') {

        tokenFilePath = path.resolve("./utils/toolkit/forecasting/" + tokenFileName);
        operationFilePath = path.resolve("./utils/toolkit/forecasting/" + operationFileName);
        apifile = path.resolve("./utils/toolkit/forecasting/toolkit_app.py");
        requiremets = path.resolve("./utils/toolkit/forecasting/requirements.txt");
        readme = path.resolve("./utils/toolkit/forecasting/readme.md");
        preprocessedFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: trainingData.preprocessedFilepath });
    } else if (algoType == 'clustering') {
        tokenFilePath = path.resolve("./utils/toolkit/clustering/" + tokenFileName);
        operationFilePath = path.resolve("./utils/toolkit/clustering/" + operationFileName);
        apifile = path.resolve("./utils/toolkit/clustering/toolkit_app.py");
        requiremets = path.resolve("./utils/toolkit/clustering/requirements.txt");
        readme = path.resolve("./utils/toolkit/clustering/readme.md");
        preprocessedFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: trainingData.preprocessedFilepath });
    } else {
        tokenFilePath = path.resolve("./utils/toolkit/" + tokenFileName);
        operationFilePath = path.resolve("./utils/toolkit/" + operationFileName);
        apifile = path.resolve("./utils/toolkit/toolkit_app.py");
        requiremets = path.resolve("./utils/toolkit/requirements.txt");
        readme = path.resolve("./utils/toolkit/readme.md");
    }
    ui_template = path.resolve("./utils/toolkit/index.html");
    modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.modelMetaData.modelPath });
    if (trainingData.edaId.isMultipleTimeseries) {
        forecastModelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.modelMetaData.forecastModelPath });
    }
    if (algoName == 'Polynomial Regression' && trainingData.hptPreference) {
        trainingData.hptPreference.forEach(function (data) {
            if (data.algoName == 'Polynomial Regression') {
                data.fields.forEach(function (fdata) {
                    if (fdata.name == "degree") {
                        polynomialDegree = fdata.data;
                    }
                });
            }
        });
    }
    genToolkitMetaData({
        filesData: req.fileData,
        modelData: modelData,
        trainingData: req.trainingData,
        fileSource: req.fileData.fileSource,
        fileSchema: req.notebookInputFile ? req.notebookInputFile.fileSchema : req.fileData.fileSchema,
        notebookInputFile: req.notebookInputFile ? req.notebookInputFile : null,
        edaId: req.trainingData.edaId,
        projectId: req.trainingData.projectId,
        trainingId: req.trainingData._id,
        logTransformationColumns: req.trainingData.logTransformationColumns,
        scalarValue: req.trainingData.scalarValue,
        algoName: algoName,
        algoType: algoType,
        featureCoefficient: modelData.modelMetaData.featureCoefficient,
        featureImportance: modelData.modelMetaData.featureImportance,
        polynomialDegree: polynomialDegree,
        problemType: req.trainingData.problemType,
        indepVariable: req.trainingData.indepVariable,
        isMultilabel: req.trainingData.isMultilabel,
        trainingShape: req.modelData.dataFrameShape,
        exogVariables: req.trainingData.timeseriesInfo ? req.trainingData['timeseriesInfo'].exogVariables : null,
        resamplingMethod: req.trainingData.timeseriesInfo ? req.trainingData.timeseriesInfo.resamplingMethod : null,
        method: req.trainingData.timeseriesInfo ? req.trainingData.timeseriesInfo.method : null,
        predictiveModelingInfo: req.trainingData.predictiveModelingInfo ? req.trainingData.predictiveModelingInfo : null,
        nlpConfigs: req.trainingData.nlpConfigs ? req.trainingData.nlpConfigs : null,
        projectType: projectType || null,
        createdAt: req.trainingData.createdAt
    }, function (err, data) {
        var zipOutDir = pathGenerator({ projectId: req.trainingData.projectId, fileName: 'TK-' + req.query.projectName + '-' + algoName + '-' + req.trainingData._id + '.zip' });
        var output = fs.createWriteStream(zipOutDir);
        var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        //archive.append(null, { name: 'directory/' });
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
            if (req.query.operation == 'model-deployment') {
                var host = req.settings;
                var formData = {};
                formData.file = fs.createReadStream(zipOutDir);
                //amul - code for passing url from query param hostId
                request.post({ url: host.url + '/api/upload_model', formData: formData }, function optionalCallback(err, httpResponse, body) {
                    if (err) {
                        return res.status(400).send(body);
                    }
                    res.send(body);
                });
                // return res.download(zipOutDir);
            } else {
                return res.download(zipOutDir);
            }
        });
        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        // pipe archive data to the file
        archive.pipe(output);
        var directoryName = 'Toolkit' + req.trainingData._id + "/";

        var modelName = null;
        if (algoName.includes('Artificial Neural Network')) {
            modelName = algoName.split(" ").join("_").toLowerCase() + "model.h5";
        } else {
            let ext;
            if (trainingData.edaId.isMultipleTimeseries) {
                ext = modelData.modelMetaData.forecastModelPath.substring(modelData.modelMetaData.forecastModelPath.lastIndexOf('.') + 1);
                modelName = algoName.split(" ").join("_").toLowerCase() + "model" + '.' + ext;
                forecastmodelName = modelData.modelMetaData.forecastModelPath;
            } else {
                ext = modelData.modelMetaData.modelPath.substring(modelData.modelMetaData.modelPath.lastIndexOf('.') + 1);
                modelName = algoName.split(" ").join("_").toLowerCase() + "model" + '.' + ext;
            }

        }
        if (algoType == 'timeseries') {
            //Predictive modeling
            if (notebooks) {
                notebooks.forEach(function (item) {
                    var preprocessedFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: 'notebooks/' + item });
                    if (fs.existsSync(preprocessedFilepath)) {
                        archive.append(fs.createReadStream(preprocessedFilepath), { name: 'notebooks/' + item });
                    }
                });
            }
            // append files from a sub-directory and naming it `static` within the archive
            // append files from a sub-directory and naming it `build` within the archive
            var staticDirName = directoryName + 'build/app/static';
            var appFolder = directoryName + 'build/app/';
            var buildFolder = directoryName + 'build';
            if (platform == 'multi-model') {
                //append Original training file
                if (req.query.psType != 'pslite') {
                    if (fs.existsSync(originalTrainingFile)) {
                        archive.append(fs.createReadStream(originalTrainingFile), { name: req.fileData.filename });
                    } else {
                        originalTrainingFile = null;
                    }
                }
                //append trainPipeFilePath
                if (fs.existsSync(trainPipeFilePath)) {
                    archive.append(fs.createReadStream(trainPipeFilePath), { name: "trainPipeFilePath.pkl" });
                } else {
                    trainPipeFilePath = null;
                }
                //append xTest
                if (fs.existsSync(xTest)) {
                    archive.append(fs.createReadStream(xTest), { name: "xTest.pkl" });
                } else {
                    xTest = null;
                }
                if (trainingData.edaId.isMultipleTimeseries) {
                    archive.append(fs.createReadStream(path.resolve(forecastModelPath)), { name: forecastmodelName });
                }
                //append metadata file
                archive.append(fs.createReadStream(data.metaDataFilePath), { name: data.fileName });
                archive.append(fs.createReadStream(path.resolve(modelFilePath)), { name: modelName });
                // archive.append(JSON.stringify(data.uiMetaData), { name: "ui_config.json" });
            } else {
                if (platform == "windows") {

                    archive.directory(path.resolve('./utils/toolkit/forecasting/build_windows'), buildFolder);
                    // archive.directory(path.resolve('./utils/toolkit/static'), staticDirName);

                } else if (platform == "ubuntu") {
                    archive.directory(path.resolve('./utils/toolkit/forecasting/build_linux'), buildFolder);
                } else if (platform == "docker") {
                    archive.directory(path.resolve('./utils/toolkit/forecasting/build_docker'), buildFolder);
                }
                archive.directory(path.resolve('./utils/toolkit/static'), staticDirName);
                //append Toolkit App UI files
                archive.append(JSON.stringify(data.uiMetaData), { name: staticDirName + "/ui_metadata.json" });
                //index.html is the entry page foe web app
                archive.append(fs.createReadStream(ui_template), { name: buildFolder + "/app/templates/index.html" });

                //append xTest
                if (fs.existsSync(xTest)) {
                    archive.append(fs.createReadStream(xTest), { name: appFolder + "xTest.pkl" });
                } else {
                    xTest = null;
                }

                //append trainPipeFilePath
                if (fs.existsSync(trainPipeFilePath)) {
                    archive.append(fs.createReadStream(trainPipeFilePath), { name: appFolder + "trainPipeFilePath.pkl" });
                } else {
                    trainPipeFilePath = null;
                }

                //append metadata file
                archive.append(fs.createReadStream(data.metaDataFilePath), { name: appFolder + data.fileName });
                //append model

                archive.append(fs.createReadStream(path.resolve(modelFilePath)), { name: appFolder + modelName });
                if (trainingData.edaId.isMultipleTimeseries) {
                    archive.append(fs.createReadStream(path.resolve(forecastModelPath)), { name: forecastmodelName });
                }
            }

        } else if (algoType == 'clustering') {
            if (notebooks) {
                notebooks.forEach(function (item) {
                    var preprocessedFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: 'notebooks/' + item });
                    if (fs.existsSync(preprocessedFilepath)) {
                        archive.append(fs.createReadStream(preprocessedFilepath), { name: 'notebooks/' + item });
                    }
                });
            }

            // append files from a sub-directory and naming it `static` within the archive
            // append files from a sub-directory and naming it `build` within the archive
            var staticDirName = directoryName + 'build/app/static';
            var appFolder = directoryName + 'build/app/';
            var buildFolder = directoryName + 'build';
            if (platform == 'multi-model') {
                //append Original training file
                if (req.query.psType != 'pslite') {
                    if (fs.existsSync(originalTrainingFile)) {
                        archive.append(fs.createReadStream(originalTrainingFile), { name: req.fileData.filename });
                    } else {
                        originalTrainingFile = null;
                    }
                }
                //append trainPipeFilePath
                if (fs.existsSync(trainPipeFilePath)) {
                    archive.append(fs.createReadStream(trainPipeFilePath), { name: "trainPipeFilePath.pkl" });
                } else {
                    trainPipeFilePath = null;
                }
                //append metadata file
                archive.append(fs.createReadStream(data.metaDataFilePath), { name: data.fileName });
                archive.append(fs.createReadStream(path.resolve(modelFilePath)), { name: modelName });
                //archive.append(JSON.stringify(data.uiMetaData), { name: "ui_config.json" });
            } else {
                if (platform == "windows") {

                    archive.directory(path.resolve('./utils/toolkit/clustering/build_windows'), buildFolder);
                    // archive.directory(path.resolve('./utils/toolkit/static'), staticDirName);

                } else if (platform == "ubuntu") {
                    archive.directory(path.resolve('./utils/toolkit/clustering/build_linux'), buildFolder);
                } else if (platform == "docker") {
                    archive.directory(path.resolve('./utils/toolkit/clustering/build_docker'), buildFolder);
                }
                archive.directory(path.resolve('./utils/toolkit/static'), staticDirName);
                //append Toolkit App UI files
                archive.append(JSON.stringify(data.uiMetaData), { name: staticDirName + "/ui_metadata.json" });
                //index.html is the entry page foe web app
                archive.append(fs.createReadStream(ui_template), { name: buildFolder + "/app/templates/index.html" });

                //append trainPipeFilePath
                if (fs.existsSync(trainPipeFilePath)) {
                    archive.append(fs.createReadStream(trainPipeFilePath), { name: appFolder + "trainPipeFilePath.pkl" });
                } else {
                    trainPipeFilePath = null;
                }
                //append metadata file
                archive.append(fs.createReadStream(data.metaDataFilePath), { name: appFolder + data.fileName });
                //append model
                // var modelName = algoName.split(" ").join("_").toLowerCase()+"model.sav";
                archive.append(fs.createReadStream(path.resolve(modelFilePath)), { name: appFolder + modelName });
            }

        } else {
            //Predictive modeling
            if (notebooks) {
                notebooks.forEach(function (item) {
                    var preprocessedFilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: 'notebooks/' + item });
                    if (fs.existsSync(preprocessedFilepath)) {
                        archive.append(fs.createReadStream(preprocessedFilepath), { name: 'notebooks/' + item });
                    }
                });
            }


            // append files from a sub-directory and naming it `static` within the archive
            // append files from a sub-directory and naming it `build` within the archive
            var staticDirName = directoryName + 'build/app/static';
            var appFolder = directoryName + 'build/app/';
            var buildFolder = directoryName + 'build';
            if (platform == 'multi-model') {
                //append Original training file
                if (req.query.psType != 'pslite') {
                    if (fs.existsSync(originalTrainingFile)) {
                        archive.append(fs.createReadStream(originalTrainingFile), { name: req.fileData.filename });
                    } else {
                        originalTrainingFile = null;
                    }
                }
                //append trainPipeFilePath
                if (fs.existsSync(trainPipeFilePath)) {
                    archive.append(fs.createReadStream(trainPipeFilePath), { name: "trainPipeFilePath.pkl" });
                } else {
                    trainPipeFilePath = null;
                }
                //append metadata file
                archive.append(fs.createReadStream(data.metaDataFilePath), { name: data.fileName });
                archive.append(fs.createReadStream(path.resolve(modelFilePath)), { name: modelName });
                // archive.append(JSON.stringify(data.uiMetaData), { name: "ui_config.json" });
            } else {
                if (platform == "windows") {

                    archive.directory(path.resolve('./utils/toolkit/predictive/build_windows'), buildFolder);
                    // archive.directory(path.resolve('./utils/toolkit/static'), staticDirName);

                } else if (platform == "ubuntu") {
                    archive.directory(path.resolve('./utils/toolkit/predictive/build_linux'), buildFolder);
                } else if (platform == "docker") {
                    archive.directory(path.resolve('./utils/toolkit/predictive/build_docker'), buildFolder);
                }
                archive.directory(path.resolve('./utils/toolkit/static'), staticDirName);
                //append Toolkit App UI files
                archive.append(JSON.stringify(data.uiMetaData), { name: staticDirName + "/ui_metadata.json" });
                //index.html is the entry page foe web app
                archive.append(fs.createReadStream(ui_template), { name: buildFolder + "/app/templates/index.html" });

                //append trainPipeFilePath
                if (fs.existsSync(trainPipeFilePath)) {
                    archive.append(fs.createReadStream(trainPipeFilePath), { name: appFolder + "trainPipeFilePath.pkl" });
                } else {
                    trainPipeFilePath = null;
                }
                //append metadata file
                archive.append(fs.createReadStream(data.metaDataFilePath), { name: appFolder + data.fileName });
                //append model
                // var modelName = algoName.split(" ").join("_").toLowerCase()+"model.sav";
                archive.append(fs.createReadStream(path.resolve(modelFilePath)), { name: appFolder + modelName });
            }
            if (algoType == 'classification') {
                archive.append(data.confusionMatrix, { name: "confusionMatrix.txt" });
            }
        }

        if (data.indexPath) {
            indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: data.indexPath });
            //appends index file
            if (fs.existsSync(indexPath)) {
                archive.append(fs.createReadStream(indexPath), { name: data.indexPath });
            }
        }

        var configData = {
            metaDataFilePath: data.fileName,
            modelFilePath: modelName,
            xTest: xTest ? 'xTest.pkl' : null,
            trainPipeFilePath: trainPipeFilePath ? "trainPipeFilePath.pkl" : null,
            indexPath: data.indexPath ? data.indexPath : null,
        };
        if (req.query.psType != 'pslite') {
            configData.originalTrainingFile = originalTrainingFile ? req.fileData.filename : null;
        }
        if (algoType == 'classification') {
            configData.confusionMatrixFilename = data.confusionMatrix ? 'confusionMatrix.txt' : null
        }
        if (algoType == 'timeseries') {
            configData.forecastModelPath = forecastmodelName;
        }
        if (platform == 'multi-model') {
            archive.append(JSON.stringify(configData), { name: "config.json" });
        } else {
            archive.append(JSON.stringify(configData), { name: appFolder + "config.json" });
        }
        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        archive.finalize();
    });
};

/**
 * Function will fetch data from multiple tables and generate a json file with required data
 * @param params, will contain params like edaId, projectId
 * @param callback, callback function which will return the generated json filepath
 */
function genToolkitMetaData(params, callback) {
    var taExperimentsData = TaExperiments.find({ _id: params.filesData.taExperimentId, projectId: params.projectId }).exec();
    var edaData = Eda.find({ _id: params.edaId, projectId: params.projectId }).exec();
    var trainingData = Trainings.find({ _id: params.trainingId, projectId: params.projectId }).exec();
    var timeseriesGroupList = timseriesGroup.find({ modelId: params.modelData._id }).exec();
    Promise.all([edaData, trainingData, taExperimentsData, timeseriesGroupList]).then(function (data) {
        metaDataGeneration(params, data).then(
            function (tempData) {
                let indexPath = data[0][0];
                var matrix = tempData.confusion;
                delete tempData['confusion'];
                var wStream,
                    filepath;
                var fileName = 'metadata' + params.trainingId + '.json';
                filepath = pathGenerator({ projectId: params.projectId, fileName: fileName });
                wStream = fs.createWriteStream(filepath);
                wStream.write(JSON.stringify(tempData));
                wStream.end();
                wStream.on('finish', function (data) {
                    callback(null, { metaDataFilePath: filepath, fileName: fileName, uiMetaData: { formData: tempData.formData, projectType: params.projectType, algoType: tempData.algoType, fileSource: params.fileSource }, confusionMatrix: matrix, indexPath: indexPath.indexPath });
                });
            });
    });
}

function classificationReportGeneration(params) {
    return new Promise(function (resolve, reject) {
        var projectDetails = {};
        var classificationReport
        projectDetails.createdBy = params.trainingData.createdBy;
        projectDetails.projectId = params.trainingData.projectId;
        projectDetails.tab = params.edaId.dataSetInfo.devSize > 0 ? 'development' : 'holdout';
        projectDetails.depVariable = params.trainingData.depVariable;
        projectDetails.isMultilabel = params.trainingData.isMultilabel;
        projectDetails.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.trainingData.edaId.indexPath })
        projectDetails.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.transformedDatasetPath })
        projectDetails.trainPipefilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.trainPipeFilePath })
        projectDetails.classNames = params.trainingData.classNames;
        projectDetails.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.modelMetaData.modelPath });
        var options = {
            uri: ps_core_server_url + '/api/model/classificationReport',
            method: 'POST',
            json: projectDetails
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                classificationReport = body;
                resolve(classificationReport, params);
            } else {
                reject({ message: 'Could not generate reports!' });
            }
        });
    });
}

function metaDataGeneration(params, data) {
    return new Promise(function (resolve, reject) {
        var tMeataData = [];
        var tempData = {};
        var edaStrategies = [];
        var edaSummary = [];
        var experimentData = data[2];
        var edaData = data[0][0];
        var trainingData = data[1][0];
        var timeseriesGroupList = data[3];
        // data.forEach(function (resp) {
        tempData.algorithm = params.algoName;
        tempData.indepVariable = trainingData.indepVariable ? trainingData.indepVariable : null;
        tempData.depVariable = trainingData.depVariable ? trainingData.depVariable : null;
        tempData.classNames = trainingData.classNames;
        tempData.isMultilabel = params.isMultilabel;
        if (params.isMultilabel && trainingData.classNames) {
            tempData.multilabelClassNames = trainingData.classNames;
        }
        if (edaData.strategies) {
            edaStrategies = edaData.strategies;
        }
        if (edaData.edaSummary) {
            edaSummary = edaData.edaSummary;
        }
        var eda = edaSummary;
        eda = eda.map(function (item) {
            if (item.dataType == 'Decimal') {
                return {
                    colName: item.colName,
                    dataType: item.dataType,
                    mean: item.mean,
                }
            } else if (item.dataType == 'Integer') {
                return {
                    colName: item.colName,
                    dataType: item.dataType,
                    median: item.median,
                }
            }
        })
        eda = eda.filter(item => item != null);
        tempData.edaSummary = eda;
        //  });
        let taFeaturesToExclude = [];
        if (params.notebookInputFile) {
            tMeataData = generateTaMetaData(params, tempData.depVariable, taFeaturesToExclude);
        }
        if (experimentData.length && experimentData[0]['taFeatureConfig']) {
            let taExperimentData = experimentData[0]['taFeatureConfig'];
            taFeaturesToExclude = taExperimentData.map((item) => {
                return item['newFeature'];
            }).flat();
            tMeataData = generateTaMetaData(params, tempData.depVariable, taFeaturesToExclude, taExperimentData);

        }

        var tData = [];
        edaSummary.forEach(function (st) {
            var tempObj = {};
            tempObj = { featureName: st.colName, strategy: st.data_strategy, dataType: st.dataType };
            if (st.data_strategy == "Custom") {
                _.filter(edaStrategies, function (item) {
                    item.featureName == st.colName ? tempObj.value = item.value : null;
                });
            }
            tData.push(tempObj);
            if (params.indepVariable) {
                if (!params.notebookInputFile && !(experimentData.length && experimentData[0]['taFeatureConfig'])) {
                    var itemFound = params.indepVariable.find(function (data) {
                        return data.colName == st.colName;
                    });
                    if (itemFound) {
                        var itemInfileSchema = params.fileSchema.filter(function (
                            item
                        ) {
                            return item.colName == st.colName;
                        })[0];
                        var originalColName = st.colName;
                        if (itemInfileSchema) {
                            originalColName = itemInfileSchema["originalColName"];
                            tMeataData.push({
                                featureName: st.colName,
                                originalFeatureName: originalColName,
                                dataType: st.dataType,
                                data: null,
                            });
                        }
                        // tMeataData.push({ featureName: st.colName, dataType: st.dataType, data: null });
                    }
                }
                // params.indepVariable.indexOf({colName:st.colName}) !== -1 ? tMeataData.push({featureName:st.colName,dataType:st.dataType,data:null}):"";
            }
        });
        let frequency = [];
        if (params.algoType == 'timeseries' && edaData.resampling && typeof edaData.resampling === 'object') {
            tempData.frequency = edaData.resampling?.resamplingMethod;
        } else if (params.algoType == 'timeseries') {
            frequency = params.filesData.descriptiveStatistics.filter((item) => {
                return item.colName === edaData.timeseriesInfo.datetimeIndex;
            })[0];
            tempData.frequency = frequency.frequency !== '' ? frequency.frequency : 'none';
        }
        tempData.resamplingMethod = edaData.resampling && typeof edaData.resampling === 'object' ? edaData.resampling?.resamplingMethod : params.resamplingMethod;
        tempData.method = params.method;
        tempData.degree = params.polynomialDegree;
        tempData.projectType = params.problemType;
        tempData.projectId = params.projectId;
        tempData.trainingId = params.trainingId;
        tempData.modelId = params.projectId + params.trainingId + (new Date().getTime());
        tempData.foreGround = '#be7024';
        if (params.featureCoefficient != undefined) {
            tempData.featureCoefficient = params.featureCoefficient;
        }
        if (params.featureImportance != undefined) {
            tempData.featureImportance = params.featureImportance;
        }
        tempData.trainingShape = params.trainingShape;
        if (params.scalarValue) {
            tempData.scalarValue = params.scalarValue;
        }
        if (params.logTransformationColumns && params.logTransformationColumns.length) {
            tempData.logTransformationColumns = params.logTransformationColumns;
        }
        tempData.exogVariables = params.exogVariables ? params.exogVariables : null;
        tempData.predictiveModelingInfo = params.predictiveModelingInfo;
        tempData.nlpConfigs = params.nlpConfigs;
        tempData.algoType = params.algoType;
        tempData.fileSource = params.fileSource;
        tempData.createdAt = params.createdAt;
        tempData.noOfFeatures = params.trainingData.noOfFeatures;
        var modelName = null;
        if (params.algoName.includes('Artificial Neural Network')) {
            modelName = params.algoName.split(" ").join("_").toLowerCase() + "model.h5";
        } else {
            let ext;
            if (edaData.isMultipleTimeseries) {
                ext = params.modelData.modelMetaData.forecastModelPath.substring(params.modelData.modelMetaData.forecastModelPath.lastIndexOf('.') + 1);
                let forecastModelName = params.modelData.modelMetaData.forecastModelPath;
                tempData.forecastModelName = forecastModelName;
            } else {
                ext = params.modelData.modelMetaData.modelPath.substring(params.modelData.modelMetaData.modelPath.lastIndexOf('.') + 1);
            }
            modelName = params.algoName.split(" ").join("_").toLowerCase() + "model" + '.' + ext;
        }
        tempData.modelName = modelName;
        tempData.formData = tMeataData;
        tempData.trainingMetrics = {}
        var Data;
        if (params.algoType == 'classification') {
            tempData['trainingMetrics']['f1Score'] = params.modelData.modelMetaData.holdout['f1Score'];
            tempData['trainingMetrics']['overallScore'] = params.modelData.modelMetaData.holdout['overallScore'];
            tempData['trainingMetrics']['rocScore'] = params.modelData.modelMetaData.holdout['rocScore'];
            tempData['trainingMetrics']['matCoeff'] = params.modelData.modelMetaData.holdout['matCoeff'];
            tempData['trainingMetrics']['accuracy'] = params.modelData.modelMetaData.holdout['testScore'];
            tempData['trainingMetrics']['losses'] = params.modelData.modelMetaData.holdout['losses'];

            classificationReportGeneration(params).then(function (data) {
                tempData['trainingMetrics']['classificationReport'] = data;
                confusionMatrixGeneration(params).then(function (data) {
                    tempData['confusion'] = data;
                    resolve(tempData)
                }
                )
            })
        } else {
            if (params.algoType == 'regression') {
                tempData['trainingMetrics']['varianceIFactor'] = params.modelData.modelMetaData.holdout['varianceIFactor'];
                tempData['trainingMetrics']['overallScore'] = params.modelData.modelMetaData.holdout['overallScore'];
                tempData['trainingMetrics']['adjustedRsq'] = params.modelData.modelMetaData.holdout['adjustedRsq'];
                tempData['trainingMetrics']['rSquared'] = params.modelData.modelMetaData.holdout['rSquared'];
                tempData['trainingMetrics']['losses'] = params.modelData.modelMetaData.holdout['losses'];
            } else if (params.algoType == 'timeseries') {
                tempData.timeseriesIds = edaData.isMultipleTimeseries ? edaData.timeseriesIds : null;
                tempData.timeseriesGroupList = edaData.isMultipleTimeseries ? timeseriesGroupList[0].allowedGroupList : null;
                tempData.isMultipleTimeseries = edaData.isMultipleTimeseries;
                tempData.nSteps = edaData.isMultipleTimeseries ? params.trainingData.nSteps : null;
                tempData['trainingMetrics']['losses'] = params.modelData.modelMetaData['losses'];
            } else if (params.algoType == 'clustering') {
                tempData['trainingMetrics']['clusteringMetricesScore'] = params.modelData.modelMetaData['clusteringMetricesScore'];
            }

            resolve(tempData);
        }
    });
}

function generateTaMetaData(params, depVariable, taFeaturesToExclude, taExperimentData) {
    let dataArray = [];
    let filterArray = [];
    params.fileSchema.forEach(function (item) {
        if ((depVariable !== item.colName) && (!taFeaturesToExclude.includes(item.colName))) {
            dataArray.push({
                featureName: item.colName,
                originalFeatureName: item.originalColName,
                dataType: item.dataType,
                data: null,
            });
        }
    });
    if (taExperimentData) {
        params.indepVariable.forEach(function (item) {
            taExperimentData.forEach(function (data) {
                if (data['newFeature'].includes(item.colName)) {
                    filterArray.push(data['oldFeature'])
                } else {
                    filterArray.push(item['colName']);
                }
            })
        })
        if (filterArray.length) {
            dataArray = dataArray.filter(item => filterArray.includes(item.featureName))
        }
    }
    return dataArray;
}

function confusionMatrixGeneration(params) {
    return new Promise(function (resolve, reject) {
        var data = {};
        var matrix;
        data.classNames = params.trainingData.classNames;
        data.algoType = params.algoType;
        data.backGround = '#ffffff';
        data.foreGround = '#08509d';
        data.modelFilePath = params.modelData.modelMetaData.modelPath;
        data.isMultilabel = params.trainingData.isMultilabel;
        data.tab = params.edaId.dataSetInfo.devSize > 0 ? 'development' : 'holdout';
        data.algoName = params.algoName;
        data.outputType = 'image';
        data.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.modelMetaData.modelPath });
        data.depVariable = params.trainingData.depVariable;
        data.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.trainPipeFilePath });
        data.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.transformedDatasetPath });
        data.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.trainingData.edaId.indexPath });
        // data.yPred = params.modelData.modelMetaData.yPred ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: params.trainingData.projectId, fileName: params.modelData.modelMetaData.yPred }) : null;
        var options = {
            uri: ps_core_server_url + '/api/classification/confusionMatrix',
            method: 'POST',
            json: data
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                matrix = body;
                matrix = matrix.graphContent;
                resolve(matrix);
            }
        });
    });
}

// Function will generate file path according to platform
function pathGenerator(params) {
    var filepath = null;
    if (osChecker.checkOs() == "windows") {
        filepath = destination + params.projectId + '\\' + params.fileName;
    } else {
        filepath = destination + params.projectId + '/' + params.fileName;
    }
    return filepath;
}
/**
 * Function to download prediction result
 * @param req
 * @param res
 */
exports.downloadPrediction = function (req, res) {

    var log = {
        projectId: req.predictionResult.projectId,
        userId: req.predictionResult.createdBy,
        level: "info",
        message: "Downloading prediction output"
    };
    auditLogger.logit(log);
    var file = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.predictionResult.projectId, fileName: req.predictionResult.predictionFileMetaData });
    // var file = req.predictionResult.predictionFileMetaData;
    res.download(file);
};
/**
 * Function will allow user to download analysis report
 */
exports.downloadAnalysisReport = function (req, res) {

    var log = {
        projectId: req.query.pId,
        userId: req.modelData.createdBy,
        level: "info",
        message: "Downloading analysis report"
    };
    auditLogger.logit(log);

    if (!req.query.fileName || !req.query.pId) {
        res.status(400).send({ message: "Missing required parameter" });
    }
    // var filepath = pathGenerator({projectId:req.trainingData.projectId,fileName:req.query.fileName});
    // res.download(path.resolve(filepath));
    res.download(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.query.pId, fileName: req.query.fileName }));
};

/**
 * Function to generate clssification report
 */
exports.generateClassificationReport = function (req, res) {
    var projectDetails = {};
    var trainingData = req.trainingData;
    projectDetails.createdBy = trainingData.createdBy;
    projectDetails.projectId = trainingData.projectId;
    projectDetails.tab = req.body.tab;
    projectDetails.depVariable = req.edaData.depVariable;
    projectDetails.indepVariable = trainingData.indepVariable;
    projectDetails.classNames = req.edaData.classNames;
    projectDetails.edaSummary = req.edaData.edaSummary;
    projectDetails.isMultilabel = req.edaData.isMultilabel;
    projectDetails.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
    projectDetails.isMultilabel = req.edaData.isMultilabel;
    var modelData = req.modelData;
    var log = {
        projectId: projectDetails.projectId,
        userId: projectDetails.createdBy,
        level: "info",
        message: "Generating classification report"
    };
    auditLogger.logit(log);
    projectDetails.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath })
    projectDetails.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.transformedDatasetPath })
    projectDetails.trainPipefilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.trainPipeFilePath })

    if (req.body.tab == 'scoring') {
        //Scoring
        projectDetails.transformedScoringPath = modelData.modelMetaData.scoringMetrics.transformedScoringPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath }) : null;
    }

    //projectDetails.analysisReport = req.body.analysisReport;
    var options = {
        uri: ps_core_server_url + '/api/model/classificationReport',
        method: 'POST',
        json: projectDetails
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('could not generate classification report', { error: error, Date: date });
            res.status(400).send(body);
        }
    });
};
/**
 * Function to read the prediction result and convert it into JSON format.
 * @param req
 * @param res
 */
exports.readPredictionResult = function (req, res) {
    // var filepath  = path.resolve(req.predictionResult.predictionFileMetaData);
    var filepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.predictionResult.projectId, fileName: req.predictionResult.predictionFileMetaData });
    readDataFromCsv(filepath, function (err, rows) {
        if (err) {
            logger.error("Could not find prediction results", { error: err, Date: date });
            res.status(400).send({ message: "Could not find prediction results" });
        }
        var csv_header = [];
        var output = [];
        rows.forEach(function (row, index) {
            if (index === 0) {
                csv_header = row;
            } else {
                var obj = {};
                row.forEach(function (data, index) {
                    obj[csv_header[index]] = data;
                });
                output.push(obj);
            }
        });
        res.send(output);
    });
};
/**
 * Function read the data from csv
 */
function readDataFromCsv(filepath, callback) {
    var stream = fs.createReadStream(filepath);
    var csvStream = csv.parse();
    var onData;
    var rows = [];
    onData = function (row) {
        rows.push(row);
        if (rows.length == 10) {
            csvStream.emit('doneReading'); //custom event
        }
    };
    csvStream.on("data", onData).on("doneReading", function () {
        stream.close();
        csvStream.removeListener('data', onData);
        callback(null, rows);
    });
    csvStream.on("end", function () {
        if (rows.length < 10) {
            callback(null, rows);
        }
    });
    stream.pipe(csvStream);
}
/**
 * Delete model
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
    var model = req.modelData;
    var trainingData = req.trainingData;
    model.remove(function (err) {
        if (err) {
            logger.error("Could not delete the model", { error: err, Date: date });
            res.status(400).send({ message: "Could not delete the model" });

        } else {
            var filesToBeDeleted = [];
            //Model file
            filesToBeDeleted.push(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.modelMetaData.modelPath }));
            //yPred
            if (model.modelMetaData.yPred)
                filesToBeDeleted.push(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.modelMetaData.yPred }));
            //holdOutFiles
            if (model.modelMetaData.hasOwnProperty('holdOutData')) {
                if (model.modelMetaData.holdOutData.yPred)
                    filesToBeDeleted.push(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.modelMetaData.holdOutData.yPred }));
            }
            //Scoring related files
            if (model.modelMetaData.hasOwnProperty('scoringMetrics')) {

                if (model.modelMetaData.scoringMetrics.transformedScoringPath)
                    filesToBeDeleted.push(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.modelMetaData.scoringMetrics.transformedScoringPath }));
            }
            filesToBeDeleted = _.uniq(filesToBeDeleted);
            if (filesToBeDeleted.length) {
                coreUtil.deleteFiles(filesToBeDeleted, function (err) {
                    if (err) {
                        var log = {
                            projectId: model.projectId,
                            userId: model.createdBy,
                            level: "error",
                            message: "Could not delete the files related to the model"
                        }
                        auditLogger.logit(log);
                        logger.error("Could not delete the files related to the model " + model._id, { error: err, Date: date });
                        res.send({ message: 'Could not delete the files related to the model', err: err });
                    } else {
                        var index = trainingData.algorithms.indexOf(model.modelMetaData.algoName);
                        if (index !== -1) {
                            trainingData.algorithms.splice(index, 1);
                            trainingData.markModified('algorithms');
                            updateTrainingData(trainingData).then(function (success) {
                                var log = {
                                    projectId: model.projectId,
                                    userId: model.createdBy,
                                    level: "info",
                                    message: "Model data removed"
                                }
                                auditLogger.logit(log);
                                logger.info('Model data removed for model id ' + model._id, { Date: date });
                                res.send({ message: 'Model data removed successfully.' });
                            }, function (err) {
                                logger.info('Could not remove model data from training.', { Date: date });
                                res.send({ message: 'Model data removed but could not remove from training.' })
                            })
                        } else {
                            var log = {
                                projectId: model.projectId,
                                userId: model.createdBy,
                                level: "info",
                                message: "Model data removed"
                            }
                            auditLogger.logit(log);
                            logger.info('Model data removed for model id ' + model._id, { Date: date });
                            res.send({ message: 'Model data removed successfully.' });
                        }

                    }
                });
            }
        }
    });
};
function updateTrainingData(trainig) {
    return trainig.save();
}
function edaDataFinder(edaId, callback) {
    Eda.findById(edaId).exec(function (err, res) {
        callback(err, res);
    });
}
/**
 * Function to trigger prediction
 * @param req
 * @param res
 */
exports.doPrediction = function (req, res) {
    var trainingData = req.trainingData;
    var modelData = req.modelData;
    var projectDetails = req.body;
    if (projectDetails.algoType == 'clustering') {
        projectDetails.decompositionObj = trainingData.decompositionObj;
        projectDetails.normalizationObj = trainingData.normalizationObj;
    }
    var trainPipeFilePath = null;
    if (projectDetails.hasOwnProperty('reTrainFileId')) {
        trainPipeFilePath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.fileData['reTrainingData']['trainPipeFilePath'] }) : null;
        projectDetails.xTrain = modelData.xTrain ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.fileData['reTrainingData']['xTrain'] }) : null;
    } else {
        trainPipeFilePath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.trainPipeFilePath }) : null;
        projectDetails.xTrain = modelData.xTrain ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.xTrain }) : null;
    }
    projectDetails.type = projectDetails.algoType;
    var predFileMetaData = req.body.predictionFile;
    projectDetails.degree = 2;
    if (projectDetails.algoName == 'Polynomial Regression' && trainingData.hptPreference) {
        trainingData.hptPreference.forEach(function (data) {
            if (data.algoName == 'Polynomial Regression') {
                data.fields.forEach(function (fdata) {
                    if (fdata.name == "degree") {
                        projectDetails.degree = fdata.data;
                    }
                });
            }
        });
    }

    projectDetails.createdBy = req.user._id;
    projectDetails.projectId = trainingData.projectId;

    projectDetails.modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: projectDetails.modelFilePath });
    if (projectDetails.predictionFile) {
        var fileEncoding = req.body.predictionFile.fileEncoding;
        projectDetails.fileEncoding = fileEncoding;
        var predictionFilePath = projectDetails.predictionFile.filepath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: projectDetails.predictionFile.filepath }) : null;
        // if(fs.existsSync(projectDetails.predictionFile.filepath)){
        if (fs.existsSync(predictionFilePath)) {
            // projectDetails.predictionFile = path.resolve(projectDetails.predictionFile.filepath);
            projectDetails.predictionFile = predictionFilePath;
        }
        delete predFileMetaData.filename;
    } else {
        projectDetails.fileEncoding = trainingData.fileEncoding;
    }
    projectDetails.trainPipeFilePath = trainPipeFilePath;
    projectDetails.classNames = req.edaData.classNames;
    projectDetails.isMultilabel = req.edaData.isMultilabel;
    projectDetails.depVariable = trainingData.depVariable;
    projectDetails.indepVariable = trainingData.indepVariable;
    projectDetails.edaSummary = req.edaData.edaSummary;
    // setting the allowed no of rows and cols value to data for restriction - only for saas.
    // -1 is for enterprise and super_admin - no restriction for rows and cols.
    projectDetails.noOfRowsAllowed = -1;
    projectDetails.noOfColsAllowed = -1;
    if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
        let userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
        let data = null;
        Plans.findOne({ planType: userPlanType }, function (err, planTemplateData) {
            if (err) {
                logger.error('Can not add new Plan to the plans collection', { Date: date })
                return res.status(400).send(err.message);
            }
            data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'model');
            data.rules.find(item => {
                if (item.name === 'numberofrowsallowedforqp') {
                    projectDetails.noOfRowsAllowed = item.allowedValues;
                }
                if (item.name === 'numberofcolumnsallowedforqp') {
                    projectDetails.noOfColsAllowed = item.allowedValues;
                }
            });
        });
        // if (userPlanType === "pro") {
        //     projectDetails.noOfRowsAllowed = proSubscription.model.quickPrediction.noOfRowsPermitForPro;
        //     projectDetails.noOfColsAllowed = proSubscription.model.quickPrediction.noOfColsPermitForPro;
        // } else if (userPlanType === "basic") {
        //     projectDetails.noOfRowsAllowed = basicSubscription.model.quickPrediction.noOfRowsPermitForBasic;
        //     projectDetails.noOfColsAllowed = basicSubscription.model.quickPrediction.noOfColsPermitForBasic;
        // }
    }
    var options = {
        uri: ps_core_server_url + '/api/prediction/start',
        method: 'POST',
        json: projectDetails
    };
    request(options, function (error, response, body) {
        //if (!error && response.statusCode == 200) {
        //    res.send(body[0].htmlContent)
        //}
    });
    res.send({ status: "success", message: "Prediction started" });


};

/**
 * Function to save prediction result
 * @param req
 * @param res
 */
exports.predictionDone = function (req, res) {
    var predictionResult = req.body;
    if (req.query.result == "error") {
        socket.emit("predictionCompleted", { status: 'failed', data: predictionResult }, { _id: predictionResult.projectId, createdBy: predictionResult.createdBy });
        return res.send({ status: "success", message: "Received error report" });
    }
    predictionResult.trainingId = predictionResult.modelId;
    var predictionResultModel = new PredictionResultModel(predictionResult);
    predictionResultModel.save(function (err, prediction) {
        if (err) {
            logger.error('Could not save prediction result' + err);
            res.status(400).send({ message: "Could not save prediction result" });
        }
        // predictionResult.predictionFileMetaData = prediction.predictionFileMetaData;
        predictionResult._id = prediction._id;
        socket.emit("predictionCompleted", predictionResult, { _id: prediction.projectId, createdBy: prediction.createdBy });
        res.send({ status: "success", message: "Prediction result saved successfully" });
    });
};
/**
 * FUnction get the confusion matrix image
 */
exports.getConfusionMatrix = function (req, res) {
    var data = req.body;
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    data.depVariable = req.edaData.depVariable;
    data.indepVariable = trainingData.indepVariable;
    data.classNames = req.edaData.classNames;
    data.edaSummary = req.edaData.edaSummary;
    data.isMultilabel = req.edaData.isMultilabel;
    data.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
    data.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: data.modelPath });
    data.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: data.trainPipeFilePath });
    data.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: data.transformedDatasetPath });
    data.outputType = 'json';
    if (data.tab == 'scoring') {
        //Scoring
        data.transformedScoringPath = modelData.modelMetaData.scoringMetrics.transformedScoringPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath }) : null;

    }
    var options = {
        uri: ps_core_server_url + '/api/classification/confusionMatrix',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Could not generate confusion matrix' + body, { Date: date });
            res.status(400).send(body);
        }
    });
};

/**
 * regression line plot
 * @param {*} req 
 * @param {*} res 
 */
exports.getRegressionLinePlot = function (req, res) {
    var regressionLinePlotData = req.body;
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    regressionLinePlotData.depVariable = req.edaData.depVariable;
    regressionLinePlotData.indepVariable = trainingData.indepVariable;
    regressionLinePlotData.classNames = req.edaData.classNames;
    regressionLinePlotData.edaSummary = req.edaData.edaSummary;
    regressionLinePlotData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
    regressionLinePlotData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: regressionLinePlotData.modelPath });
    regressionLinePlotData.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: regressionLinePlotData.trainPipeFilePath });
    regressionLinePlotData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: regressionLinePlotData.transformedDatasetPath });
    if (req.body.tab == 'scoring') {
        //Scoring
        regressionLinePlotData.transformedScoringPath = modelData.modelMetaData.scoringMetrics.transformedScoringPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath }) : null;
    }
    var options = {
        uri: ps_core_server_url + '/api/model/regressionline',
        method: 'POST',
        json: regressionLinePlotData
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('could not generate regression line plot', { Date: date })
            res.status(400).send(body);
        }
    });
};
/**
 *Function to get RocAucCurveGraph
 */
exports.getRocAucCurveGraph = function (req, res) {
    var rocaucData = {};
    rocaucData = req.body;
    //This will contain yPred,yHoldout etc
    var modelData = req.modelData;
    var projectId = req.trainingData.projectId;
    rocaucData.projectId = projectId;
    rocaucData.classNames = req.trainingData.classNames;
    rocaucData.depVariable = req.edaData.depVariable;
    rocaucData.indepVariable = req.trainingData.indepVariable;
    rocaucData.classNames = req.edaData.classNames;
    rocaucData.edaSummary = req.edaData.edaSummary;
    rocaucData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: projectId, fileName: rocaucData.transformedDatasetPath });
    rocaucData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: projectId, fileName: req.edaData.indexPath });
    rocaucData.trainPipefilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: projectId, fileName: req.body.trainPipeFilePath });
    rocaucData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath });
    if (req.body.tab == 'scoring') {
        //Scoring
        rocaucData.transformedScoringPath = modelData.modelMetaData.scoringMetrics.transformedScoringPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath }) : null;
    }
    var options = {
        uri: ps_core_server_url + '/api/classification/roc_auc',
        method: 'POST',
        json: rocaucData
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
 * Function to generate liftgain chart, this will call an api in pscore
 */
exports.getLiftGainGraph = function (req, res) {
    var liftgainData = {};
    liftgainData = req.body;
    //This will contain yPred,yHoldout etc
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    var fileData = req.fileData;
    var projectId = trainingData.projectId;
    liftgainData.projectId = projectId;
    liftgainData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: liftgainData.transformedDatasetPath });
    liftgainData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
    liftgainData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.body.modelPath });
    liftgainData.trainPipefilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: liftgainData.trainPipeFilePath });
    liftgainData.depVariable = req.edaData.depVariable;
    liftgainData.indepVariable = trainingData.indepVariable;
    liftgainData.classNames = req.edaData.classNames;
    liftgainData.edaSummary = req.edaData.edaSummary;
    if (req.body.tab == 'scoring') {
        //Scoring
        liftgainData.transformedScoringPath = modelData.modelMetaData.scoringMetrics.transformedScoringPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath }) : null;

    }
    var options = {
        uri: ps_core_server_url + '/api/classification/liftGain',
        method: 'POST',
        json: liftgainData
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}
/**
 * Function to generate PR Curve, this will call an api in pscore
 */
exports.getPRCurve = function (req, res) {
    var prData = {};
    prData = req.body;
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    prData.projectId = trainingData.projectId;
    prData.depVariable = req.edaData.depVariable;
    prData.indepVariable = trainingData.indepVariable;
    prData.classNames = req.edaData.classNames;
    prData.edaSummary = req.edaData.edaSummary;
    prData.isMultilabel = req.edaData.isMultilabel;
    prData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath })
    prData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
    prData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.transformedDatasetPath })
    prData.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.trainPipeFilePath })
    if (req.body.tab == 'scoring') {
        //Scoring
        prData.transformedScoringPath = modelData.modelMetaData.scoringMetrics.transformedScoringPath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath }) : null;
    }
    var options = {
        uri: ps_core_server_url + '/api/classification/precisionRecall',
        method: 'POST',
        json: prData
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}
/**
 * Function to get learning curve
 */
exports.getLearningGraph = function (req, res) {
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    var lcData = {
        kFold: trainingData.kFold,
        testSize: trainingData.testSize,
        algoName: req.query.algoName,
        projectId: trainingData.projectId,
        validationStrategy: modelData.validationStrategy,
        foreGround: req.body.fg,
        backGround: req.body.bg,
        algoType: req.body.algoType
    };
    lcData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.transformedDatasetPath });
    lcData.modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.modelMetaData.modelPath });
    var options = {
        uri: ps_core_server_url + '/api/model/learningCurve',
        method: 'POST',
        json: lcData
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
};

exports.getLimeReport = function (req, res) {
    var limeData = req.body;
    var modelData = req.modelData;
    var trainingData = req.trainingData;
    limeData.depVariable = req.edaData.depVariable;
    limeData.indepVariable = trainingData.indepVariable;
    limeData.classNames = req.edaData.classNames;
    limeData.edaSummary = req.edaData.edaSummary;
    limeData.algoType = trainingData.algoType;
    limeData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.body.modelPath })
    limeData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.indexPath });
    limeData.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.trainPipeFilePath });
    limeData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: limeData.transformedDatasetPath });
    limeData.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: req.edaData.fileId.filename });
    if (limeData.type == "file_upload") {
        limeData.predictionFile = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: limeData.predictionFile });
    } else if (limeData.type == "models_page") {

    }
    if (req.body.tab == 'scoring') {
        limeData.fileEncoding = trainingData.scoringfileEncoding;
        limeData.scoringDataFilePath = trainingData.scoringDataFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: trainingData.scoringDataFilePath }) : null;
        limeData.transformedScoringPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.modelMetaData.scoringMetrics.transformedScoringPath })
    }
    var options = {
        uri: ps_core_server_url + '/api/model/lime_report',
        method: 'POST',
        json: limeData
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (req.body.operation == 'download') {
                var test = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: modelData.projectId, fileName: body.htmlContent });
            }
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
};
/**
 * Function will trigger CV API
 */
exports.runCV = function (req, res) {
    var trainingData = req.trainingData;
    var modelData = req.modelData;
    var cvData = {
        modelId: modelData._id,
        trainingId: trainingData._id,
        projectId: trainingData.projectId,
        createdBy: req.user._id,
        classNames: trainingData.classNames,
        algoName: req.query.algoName,
        algoType: req.query.algoType,
        fileEncoding: trainingData.fileEncoding,
        predictiveModelingInfo: trainingData.predictiveModelingInfo,
        nlpConfigs: trainingData.nlpConfigs,
        depVariable: trainingData.depVariable
    };
    cvData.validationStrategy = {
        metric: req.query.metric,
        technique: req.query.validationStartegytechnique,
        nSplit: parseInt(req.query.validationStartegynSplit),
    };
    cvData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.transformedDatasetPath });
    cvData.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.trainPipeFilePath });
    cvData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.modelMetaData.modelPath });
    //Check if bestParams is there or not.
    var bestParams = null;
    bestParams = modelData.modelMetaData.bestParams ? modelData.modelMetaData.bestParams[modelData.modelMetaData.modelTuning] : null;
    //If bestparams available assign it to hptPreference
    if (bestParams) {
        cvData.hptPreference = bestParams;
    } else {
        if (trainingData.hptPreference && trainingData.hptPreference.length) {
            trainingData.hptPreference.forEach(function (data) {
                if (data.algoName == req.query.algoName) {
                    if (data.algoName == 'Polynomial Regression') {
                        data.fields.forEach(function (fdata) {
                            if (fdata.name == "degree") {
                                polynomialDegree = fdata.data;
                            }
                        });
                    }
                    cvData.hptPreference = [data];
                } else {
                    cvData.hptPreference = [];
                }
            });
        } else {
            cvData.hptPreference = [];
        }
    }
    Eda.find({ _id: req.query.edaId }).populate('fileId').exec(function (err, edaDoc) {
        cvData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: edaDoc[0].indexPath });
        cvData.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: edaDoc[0].fileId.filename });
        if (err) {
            logger.error('Could not find eda details', { Date: date })
            return res.status(400).send({ message: 'Could not find eda details.' })
        }
        var options = {
            uri: ps_core_server_url + '/api/crossValidate',
            method: 'POST',
            json: cvData
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                modelData.validationStrategy = cvData.validationStrategy;
                modelData.save(function (err, doc) {
                    if (err) {
                        res.status(400).send({ message: 'Could not update the model' });
                    }
                    res.send(body);
                });
            } else {
                //Update the CV status
                modelData.modelMetaData.cvData.status = 'error';
                modelData.modelMetaData.cvData.validationStrategy = cvData.validationStrategy;
                modelData.markModified('modelMetaData');
                //Save the doc
                modelData.save(function (err, doc) {
                    if (err) {
                        res.status(400).send({ message: 'Could not update the model' });
                    }
                    res.status(400).send(body);
                });
            }
        });
    })

};

module.exports.doneCV = function (req, res) {
    var modelData = req.modelData;
    var respData = req.body;
    if (req.body.cvData.status === 'failed') {
        respData.cvData.modelId = req.modelData._id;
        socket.emit("cvCompleted", { modelData: respData.cvData }, { _id: modelData.projectId, createdBy: respData.createdBy });
        res.send({ message: 'failed' });
    } else {
        modelData.modelMetaData.cvData = respData.cvData ? respData.cvData : modelData.modelMetaData.cvData;
        modelData.modelMetaData.cvData.status = 'done';
        modelData.markModified('modelMetaData');
        //Save the doc
        modelData.save(function (err, doc) {
            if (err) {
                res.status(400).send({ message: 'Could not update the model' });
            }
            socket.emit("cvCompleted", { modelData: doc }, { _id: modelData.projectId, createdBy: respData.createdBy });
            res.send({ message: 'success' });
        });
    }
};

function getModelInfo(modelData, algoName) {
    var result = {};
    modelData.modelMetaData.forEach(function (data) {
        if (data[0].algoName == algoName) {
            // result.modelFilePath = path.resolve(data[0].modelPath);
            result.modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: data[0].modelPath });
        }
    });
    return result;
}
/**
 * Funcction to fetch saved prediction result.
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.predictionById = function (req, res, next, id) {
    PredictionResultModel.findById(id).exec(function (err, predictionResult) {
        if (err) {
            logger.error("Error while finding project configuration", { error: err, Date: date });
            return next(err);
        } else if (!predictionResult) {
            return res.status(404).send({ message: "No project Configuration with that identifier has been found" });
        }
        req.predictionResult = predictionResult;
        next();
    });
};
/**
 * Function to update the cv status
 */
exports.updateCVStatus = function (req, res, next) {
    var modelData = req.modelData;
    if (!req.query.cvStatus) {
        return res.send({ message: 'Missing cvStatus!' });
    }
    //If the cvData object is not there create a new object and save to DB
    modelData.modelMetaData.cvData = modelData.modelMetaData.cvData ? modelData.modelMetaData.cvData : {};
    modelData.isNew = false;
    //Mark the fild as modified
    modelData.markModified('modelMetaData');
    //Save the doc
    modelData.save(function (err, doc) {
        if (err) {
            res.status(400).send({ message: 'Could not update the model' });
        }
        next();
    });
};
/**
 * Function to read html file and send the content to UI
 */
exports.generateClusterVisualization = function (req, res) {
    var clusterVisInput = req.body;
    var trainingData = req.trainingData;
    var modelData = req.modelData;
    clusterVisInput.rootFileName = clusterVisInput.rootFileName ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: clusterVisInput.rootFileName }) : null;
    clusterVisInput.numericFeatures = trainingData.clusteringInfo ? trainingData.clusteringInfo.numericFeatures : null;
    // clusterVisInput.arFilePath = modelData.analysisReport ? uploadUtil.costructAbsPath({baseDir:config.projectDir,projectId:trainingData.projectId,fileName:modelData.analysisReport}):null; 
    clusterVisInput.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.modelMetaData.modelPath });
    // clusterVisInput.scalerObj = req.trainingData.scalerObj ? path.resolve(req.trainingData.scalerObj):null;
    clusterVisInput.scalerObj = trainingData.scalerObj ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: trainingData.scalerObj }) : null;
    // clusterVisInput.normalizationObj = req.trainingData.normalizationObj ? path.resolve(req.trainingData.normalizationObj):null;
    clusterVisInput.normalizationObj = trainingData.normalizationObj ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: trainingData.normalizationObj }) : null;
    // clusterVisInput.decompositionObj = req.trainingData.decompositionObj ? path.resolve(req.trainingData.decompositionObj):null;
    clusterVisInput.decompositionObj = trainingData.decompositionObj ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: trainingData.decompositionObj }) : null;
    // clusterVisInput.xTrain = req.modelData.xTrain ? path.resolve(req.modelData.xTrain):null;
    clusterVisInput.indepVariable = req.trainingData.indepVariable;
    clusterVisInput.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: modelData.trainPipeFilePath });
    clusterVisInput.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: clusterVisInput.transformedDatasetPath });
    clusterVisInput.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: clusterVisInput.indexPath });

    //Constructing the request object
    var options = {
        uri: ps_core_server_url + '/api/clustering/visualization',
        method: 'POST',
        json: clusterVisInput
    };
    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}
/**
 * Trigger API to get evaluate forecast graph
 */
module.exports.evaluateForecastGraph = function (req, res) {
    var evalForecastInput = req.body;
    var trainingData = req.trainingData;
    var modelData = req.modelData;
    evalForecastInput.projectId = trainingData.projectId;
    evalForecastInput.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: evalForecastInput.filename });
    evalForecastInput.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: evalForecastInput.indexPath });
    evalForecastInput.parentPipelineFilename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: evalForecastInput.parentPipelineFilename });
    evalForecastInput.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: evalForecastInput.trainPipeFilePath });
    evalForecastInput.timeseriesInfo = trainingData.timeseriesInfo || null;
    evalForecastInput.modelFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: evalForecastInput.modelPath });
    //Constructing the request object
    var options = {
        uri: evalForecastInput.isMultipleTimeseries === true ? ps_core_server_url + '/api/timeseries/multiple/evaluate_forecast' : ps_core_server_url + '/api/timeseries/evaluate_forecast',
        method: 'POST',
        json: evalForecastInput
    };
    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}
/**
* Function to generate forcasting graph
*/
exports.generateForcastingGraph = function (req, res) {
    var forecastData = req.body;
    var trainingData = req.trainingData;
    var modelData = req.modelData;

    forecastData.parentPipelineFilename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: forecastData.parentPipelineFilename });
    forecastData.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: forecastData.filename });
    forecastData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: forecastData.indexPath });
    // forecastData.afterEdaFilePath = req.modelData.miscData ? path.resolve(req.modelData.miscData.afterEdaFilePath): null;
    forecastData.trainPipeFilePath = modelData.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: modelData.trainPipeFilePath }) : null;
    // forecastData.afterEdaFilePath = req.modelData.miscData ? uploadUtil.costructAbsPath({baseDir:config.projectDir,projectId:req.trainingData.projectId,fileName:req.modelData.miscData.afterEdaFilePath}): null;
    forecastData.exogVariables = trainingData['timeseriesInfo'].exogVariables || null;
    // forecastData.depVariable = req.trainingData.depVariable;
    forecastData.resamplingMethod = req.trainingData.timeseriesInfo['resamplingMethod'] || null;
    // forecastData.method = req.trainingData.timeseriesInfo.method;
    // forecastData.timesteps = req.trainingData.timeseriesInfo.timesteps || null;
    // forecastData.xTrain = req.modelData.xTrain ? path.resolve(req.modelData.xTrain):null;
    forecastData.xTrain = req.modelData.xTrain ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.modelData.xTrain }) : null;
    // forecastData.xTest = req.modelData.xTest ? path.resolve(req.modelData.xTest):null;
    forecastData.xTest = req.modelData.xTest ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.modelData.xTest }) : null;
    // forecastData.modelPath = path.resolve(forecastData.modelPath);
    if (forecastData.isMultipleTimeseries === true) {
        forecastData.forecastModelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: forecastData.forecastModelPath });
    } else {
        forecastData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: forecastData.modelPath });
    }
    // forecastData.dateColumn = req.trainingData.dateColumnSelected || null;
    //Constructing the request object
    var options = {
        uri: forecastData.isMultipleTimeseries === true ? ps_core_server_url + '/api/timeseries/multiple/forecast' : ps_core_server_url + '/api/timeseries/forecast',
        method: 'POST',
        json: forecastData
    };

    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}
//Get the quick prediction form data
exports.populateQpFormData = function (req, res) {
    var data = {};
    let filename = req.trainingData.metaInfo.fileName;
    data['projectType'] = req.query.projectType;
    data['indepVariable'] = req.trainingData['indepVariable'];
    data.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: filename });
    data['trainPipeFilePath'] = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: req.modelData.trainPipeFilePath });
    let taFeatureConfig = req.body['taFeatureConfig'];
    if (taFeatureConfig && taFeatureConfig.length) {
        data['taFeatureConfig'] = taFeatureConfig;
        data['textAnalysisOutFilePath'] = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: req.body['textAnalysisOutFilePath'] });
    } else {
        if (req.query.projectType != 'clustering') {
            data.xHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: req.modelData.xHoldout });
        }
    }
    edaDataFinder(req.trainingData.edaId, function (err, resp) {
        var edafile = resp.afterEdaDataFilePath;
        if (err) {
            return res.status(400).send(err);
        }
        if (req.query.projectType == 'clustering') {
            data.afterEdaDataFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: edafile });
        }
        if (req.body.notebookInputFileName) {
            data.notebookInputFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: req.body.notebookInputFileName });
        }
        var options = {
            uri: ps_core_server_url + '/api/prediction/populate_data',
            method: 'POST',
            json: data
        };
        //Making http call to pscore
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send({ qpFormData: body });
            } else {
                res.status(400).send(body);
            }
        });
    });
}
//This will help us to get the pipeline tasks
exports.getPipelineTasks = function (req, res) {
    var trainingData = req.trainingData;
    findByTrainingId(trainingData._id, function (err, models) {
        if (err) {
            res.status(400).send({ message: 'Could not fetch the models', err: err })
        }
        var data = {
            trainPipeFilePath: models[0].trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: models[0].trainPipeFilePath }) : null
        }
        var options = {
            uri: ps_core_server_url + '/api/pipeline/load_pipeline',
            method: 'POST',
            json: data
        };
        //Making http call to pscore
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            } else {
                res.status(400).send(body);
            }
        });
    })
}
exports.getPipelineTaskDetails = function (req, res) {
    var data = req.body;
    var taConfig;
    var trainingData = req.trainingData;
    if (trainingData.problemType == 'timeseries') {
        data.exogVariables = trainingData.timeseriesInfo.exogVariables;
    }
    findByTrainingId(trainingData._id, function (err, models) {
        if (err) {
            return res.status(400).send({ message: 'Could not fetch the models', err: err })
        }
        var model = models[0];
        data.trainPipeFilePath = model.trainPipeFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.trainPipeFilePath }) : null
        if (data.projectType == 'predictive_modeling') {
            data.xHoldout = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.xHoldout });
        } else if (data.projectType == 'clustering') {
            data.xTrain = model.xTrain ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.xTrain }) : null;
        } else {
            data.xTest = model.xTest ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model.projectId, fileName: model.xTest }) : null;
        }
        data.depVariable = trainingData.depVariable;
        if (req.body.taExperimentId) {
            TaExperiments.find({ _id: req.body.taExperimentId }, function (err, taDoc) {
                if (err) {
                    return res.status(400).send({ message: 'Could not find taExperiments details.' })
                }
                if (taDoc.length && taDoc[0].taFeatureConfig && taDoc[0].taFeatureConfig !== null) {
                    taConfig = taDoc[0].taFeatureConfig;
                    data.taFeatureConfig = taDoc[0].taFeatureConfig;
                }
            });
        }
        Eda.find({ _id: trainingData.edaId }, function (err, edaDoc) {
            if (err) {
                return res.status(400).send({ message: 'Could not find eda details.' })
            }
            data.edaSummary = edaDoc[0].edaSummary;
            data.stringTransformation = edaDoc[0].stringTransformation;
            data.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: edaDoc[0].indexPath });
            data.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: trainingData.projectId, fileName: trainingData.metaInfo.fileName });
            var options = {
                uri: ps_core_server_url + '/api/pipeline/transformers',
                method: 'POST',
                json: data
            };
            //Making http call to pscore
            request(options, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    res.send(body);
                } else {
                    res.status(400).send(body);
                }
            });
        })

    })
}

function getPipelineDetails(trainingData, data) {

}
/**
 * Get the decision tree visualisation in image format
 */
exports.getDecisionTree = function (req, res) {
    var data = req.body;
    var modelData = req.modelData;
    data.classNames = req.edaData.classNames;
    data.isMultilabel = req.edaData.isMultilabel;
    data.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: modelData.projectId, fileName: req.edaData.indexPath });;
    data.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: modelData.projectId, fileName: data.trainPipeFilePath });;
    data.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: modelData.projectId, fileName: data.transformedDatasetPath });;
    data.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: modelData.projectId, fileName: data.modelPath });
    var options = {
        uri: ps_core_server_url + '/api/tree_algo/visulization',
        method: 'POST',
        json: data
    };
    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (req.body.operation == 'download') {
                var test = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: modelData.projectId, fileName: body.graphContent });
                res.send(body);
            } else {
                res.send(body);
            }
        } else {
            res.status(400).send(body);
        }
    });
}

/**
 * Reads the scatter html file for clustering
 * @param {*} req 
 * @param {*} res 
 */
exports.getClusterHtml = async (req, res) => {
    try {
        var file = uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: req.params.projectId,
            fileName: req.query.filename,
        });
        // Attach the nonce value for content security policy issue
        // scatterNonce - It is a variable which is set from pscore on <script> tag 
        const html = fs
            .readFileSync(file, { encoding: 'utf-8' })
            .toString();
        const template = handlebars.compile(html);
        const scatterHTML = template({
            scatterNonce: config.app.recaptchaNonce,
        });
        res.setHeader('Content-Type', 'text/html');
        res.send(scatterHTML);
    } catch (error) {
        logger.error('Error while generating plotter text plot', { error: err.message, Date: date });
        res.status(404).send({ message: 'Html file not found for scatter plot' });
    }
};

/**
 * Download file
 * @param {*} req 
 * @param {*} res 
 */
exports.downloadFile = function (req, res) {
    var Fname = req.params.fileName
    var file = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: Fname });
    // var file = req.predictionResult.predictionFileMetaData;
    res.download(file);
};

exports.downloadLimeReport = function (req, res) {
    var Fname = req.params.fileName

    var limeReportfile = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: Fname });
    // var file = req.predictionResult.predictionFileMetaData;
    res.download(limeReportfile);
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
            logger.error("Error while finding project configuration", { error: err, Date: date });
            return next(err);
        } else if (!project) {
            return res.status(404).send({ message: "No project Configuration with that identifier has been found" });
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
exports.modelById = function (req, res, next, id) {
    Models.findById(id).exec(function (err, model) {
        if (err) {
            logger.error("Error while finding model data", { error: err, Date: date });
            return next(err);
        } else if (!model) {
            return res.status(404).send({ message: "No Model with that identifier has been found" });
        }
        req.modelData = model;
        next();
    });
};

exports.findByTrainingId = findByTrainingId;
function findByTrainingId(id, callback) {
    Models.find({ trainingId: id, status: 'success' }).exec(function (err, model) {
        if (err) {
            logger.error("Error while finding model", { error: err, Date: date });
            return callback({ message: 'Error while finding model', error: err });
        }
        callback(null, model);
    });
}

/**
 * Insert deployment host
 * @param {*} req 
 * @param {*} res 
 */
exports.insertDeployment = function (req, res) {
    var data = req.body;
    data.createdBy = req.user_id;
    var deployment = new Deployment(data);
    deployment.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save Deployment', { error: err, Date: date });
            res.status(400).send({ statusText: 'Unable to save Deployment' });
        }
        else {
            logger.info('Deployment created' + doc, { Date: date });
            res.send(doc);
        }
    });
}

/**
 * generate feature impact plot
 * @param {*} req 
 * @param {*} res 
 */
module.exports.featureImpactGraph = function (req, res) {
    let modelData = {};
    Models.find({ _id: req.modelData._id }).populate('trainingId').exec(function (err, model) {
        if (model[0].trainingId.algoType == 'regression') {
            modelData.scoring = 'r2';
        } else if (model[0].trainingId.algoType == 'classification') {
            modelData.scoring = 'accuracy';
        } else {
            modelData.scoring = 'none';
        }
        if (req.query.tab == 'scoring') {
            modelData.transformedScoringPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: model[0].modelMetaData.scoringMetrics.transformedScoringPath });
        }
        let edaId;
        if (model[0].edaId !== null) {
            edaId = model[0].edaId;
        } else {
            edaId = model[0].trainingId.edaId;
        }
        edaDataFinder(edaId, function (err, edaDoc) {
            modelData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: model[0].modelMetaData.modelPath });
            modelData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: model[0].transformedDatasetPath });
            modelData.trainPipefilepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: model[0].trainPipefilepath });
            modelData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: edaDoc.indexPath });
            modelData.iterations = parseInt(req.query.iterations);
            modelData.tab = req.query.tab;
            if (err) {
                logger.error("Error while finding model", { error: err, Date: date });
                return res.status(400).send({ message: 'Error while finding model', error: err });
            }
            var options = {
                uri: ps_core_server_url + '/api/model/feature_impact',
                method: 'POST',
                json: modelData
            };
            //Making http call to pscore
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.send(body);
                } else {
                    res.status(400).send(body);
                }
            });
        });

    })
}

/**
 * generate feature distribution plot
 * @param {*} req 
 * @param {*} res 
 */
module.exports.featureDistribution = function (req, res) {
    var formData = {};
    Models.find({ _id: req.modelData._id }).populate('trainingId').exec(function (err, model) {
        if (err) {
            logger.error("Error while finding model", { error: err, Date: date });
            return res.status(400).send({ message: 'Error while finding model', error: err });
        }
        formData.indexPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: req.edaData.indexPath });
        formData.modelPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: req.body.modelPath });
        formData.fileSchema = req.edaData.fileId.fileSchema;
        formData.depVariable = req.edaData.depVariable;
        formData.indepVariable = req.body.indepVariable;
        formData.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: req.edaData.fileId.filename });
        formData.transformedDatasetPath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: req.body.transformedDatasetPath });
        formData.trainPipeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: model[0].projectId, fileName: req.body.trainPipeFilePath });
        if (req.body.bins) {
            formData.bins = parseInt(req.body.bins);
        } else {
            formData.bins = null;
        }
        formData.targetClass = req.body.targetClass;
        formData.featureName = req.body.featureName;
        var options = {
            uri: ps_core_server_url + '/api/model/feature_distribution',
            method: 'POST',
            json: formData
        };
        //Making http call to pscore
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            } else {
                res.status(400).send(body);
            }
        });
    })
}

function findRetrainEdaData(edaId) {
    return new Promise((resolve, reject) => {
        Eda.findById(edaId, function (err, doc) {
            if (err) {
                logger.error('Could not find task', { error: err, Date: date });
                reject('error while finding tasks in scheduler');
                // return res.status(400).send({ message: 'Could not find task' });
            }
            resolve(doc);
        })
    });
}

/**
 * update model by id
 * @param {*} req 
 * @param {*} res 
 */
module.exports.updateModel = function (req, res) {
    let reqObj = {
        analysisInfo: req.body.analysisMap,
        modelPath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: req.modelData.modelMetaData.modelPath })
    }
    var options = {
        uri: ps_core_server_url + '/api/clustering/label_mapping',
        method: 'POST',
        json: reqObj
    };
    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            queryObj = { _id: req.body.modelId };
            let reqObj = req.body.modelMetaData;
            reqObj.modelPath = body;
            Models.findOneAndUpdate(queryObj, { modelMetaData: reqObj }, { new: true }, function (err, doc) {
                if (err) {
                    logger.error("Could not Update Model" + 'error: ' + err, { Date: date });
                    if (res) {
                        res.status(400).send({ message: "Could not Update Model" });
                    }
                } else {
                    logger.info("Model Updated", { Date: date });
                    res.send(doc);
                }
            });
        } else {
            res.status(400).send(body);
        }
    });
}

/**
 * Generate clustering decision tree
 * @param {*} req 
 * @param {*} res 
 */
exports.generateClusterDecisionTree = function (req, res) {
    let data = req.body
    data.treeModelOutput.decision_tree_path = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: data.treeModelOutput.decision_tree_path })
    var options = {
        uri: ps_core_server_url + '/api/clustering/tree_output',
        method: 'POST',
        json: data
    };
    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (req.body.operation == 'download') {
                var test = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.modelData.projectId, fileName: body.graphContent });
                res.send(body);
            } else {
                res.send(body);
            }
        } else {
            res.status(400).send(body);
        }
    });
}

exports.generateClusterHeatMap = function (req, res) {
    let data = req.body
    data.clusterStats = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.trainingData.projectId, fileName: req.modelData.modelMetaData.clusterStats });
    var options = {
        uri: ps_core_server_url + '/api/clustering/heatmap',
        method: 'POST',
        json: data
    };
    //Making http call to pscore
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.status(400).send(body);
        }
    });
}