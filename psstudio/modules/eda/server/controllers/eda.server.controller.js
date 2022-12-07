/**
 * Created by Saket on 17/10/17.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
    edaProgress = require("../../../auditlogs/server/controllers/eda-progress.server.controller");
mongoose = require('mongoose'),
    Files = mongoose.model('Files'),
    ProjectConfig = mongoose.model('projectConfig'),
    Plans = mongoose.model('plans'),
    EdaConfig = mongoose.model('eda'),
    timseriesGroup = mongoose.model('tsGroup')
errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    csv = require('fast-csv'),
    config = require("../../../../config/config"),
    fs = require('fs');
var request = require('request');
var destination = './public/server/data/';
var socket = require("../../../../utils/socket/core.socket.utils");
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
const basicSubscription = require('../../../../config/env/plans/basic-subscription');
const proSubscription = require('../../../../config/env/plans/pro-subscription');
const handlebars = require('handlebars');

var date = Date(Date.now());
date = date.toString();
/**
 * Function to check the eda count.
 * @param {*} callback 
 */
function checkEdaLimit(req) {
    return new Promise(function (resolve, reject) {
        if (config.app.type === 'enterprise') {
            return resolve(false);
        }
        let query;
        let userPlanType;
        if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
            userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
            let startDate = new Date(req.subscription?.planStart).toISOString();
            let endDate = new Date().toISOString();
            query = {
                fileId: req?.body?.fileId
            }
        } else {
            query = {}
        }
        EdaConfig.countDocuments(query).exec(function (err, count) {
            if (err) {
                logger.error("Unable to get count of eda", { error: err, Date: date });
                return resolve(false);
            } else {
                //the request is from ps-lite
                if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin')) {
                    let edaCount = null;
                    let data = null;
                    Plans.findOne({ planType: userPlanType }, function (err, planTemplateData) {
                        if (err) {
                            logger.error('Can not add new Plan to the plans collection', { Date: date })
                            return res.status(400).send(err.message);
                        }
                        data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'eda');
                        data.rules.find(item => {
                            if (item.name === 'allowednumberofeda/file') {
                                edaCount = item.allowedValues;
                            }
                        });
                        return resolve(count >= edaCount);
                    });
                    // if (userPlanType === "pro") {
                    //     edaCount = proSubscription.eda.edaCount;
                    // } else if (userPlanType === "basic") {
                    //     edaCount = basicSubscription.eda.edaCount;
                    // }
                } else {
                    return resolve(false);
                }
            }
        });
    })
}


/**
 * Create Eda Configuration
 * @param req
 * @param res
 */
exports.create = function (req, res) {
    checkEdaLimit(req).then(function (limitReached) {
        if (limitReached) {
            logger.error('Eda limit reached', { Date: date })
            return res.status(400).send({ message: "Eda limit reached!" });
        } else {
            var edaConf = req.body;
            edaConf.createdBy = req.user._id;
            edaConf.projectId = req.project._id;
            // edaConf.fileEncoding = req.project.fileEncoding;
            edaConf.type = req.project.type;
            if (edaConf.parentPipelineFilename) {
                edaConf.parentPipelineFilename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: edaConf.parentPipelineFilename });
            }
            edaConf.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: edaConf.filePath });
            //if flow== afterFeatureMergeConfirm, then need to pass previous edas afterEdaFilePath
            if (req.query.flow == 'afterFeatureMergeConfirm') {
                // edaConf.filepath = path.resolve(req.body.afterEdaDataFilePath);
                edaConf.filepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.body.afterEdaDataFilePath });
            } else {
                edaConf.filepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.project.filename });
            }
            //Combine custom strategy with selected strategy list
            if (req.body.customCorrectionStrategy) {
                req.body.strategies.forEach(function (data) {
                    req.body.customCorrectionStrategy[data.colName] ? data.outValue = req.body.customCorrectionStrategy[data.colName] : ''
                });
            }

            if (req.body.customEdaStrategy) {
                req.body.strategies.forEach(function (data) {
                    req.body.customEdaStrategy[data.colName] ? data.value = req.body.customEdaStrategy[data.colName] : ''
                });
            }
            var edaProgressData = {
                createdBy: req.user._id,
                projectId: req.project._id
            };
            edaProgress.initEdaProgress(edaProgressData, function (err, data) {
                //Configuration for calling ps core API
                edaConf.edaProgressId = data._id;
                var options = {
                    uri: edaConf.isMultipleTimeseries === 'True' ? ps_core_server_url + '/api/timeseries/multiple/eda/v2/start' : ps_core_server_url + '/api/eda/v2/start',
                    method: 'POST',
                    json: edaConf
                };
                var log = {
                    projectId: req.project._id,
                    userId: req.user._id,
                    edaProgressId: data._id,
                    level: "info",
                    message: edaConf.edaMode + " Eda started"
                }
                auditLogger.logit(log);
                logger.info('Eda started' + log, { Date: date });
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.send(body);
                    } else {
                        logger.error('Error occurred' + 'projectId: ' + req.project._id + error, { Date: date });
                        res.status(400).send(body);
                    }
                });
            });
        }
    }, function (err) {
        return res.status(400).send(err);
    })
};
/*
    Function to update the project status
 */
function updateProjectStatus(project) {
    var edaCount = (project.edaCount * 1) + 1;
    var update = {};
    update = {
        edaCount: edaCount
    };
    ProjectConfig.updateOne({ _id: project._id }, {
        $set: update
    }, function (err, affected, resp) {
        if (err) {
            logger.error('Could not update eda count' + edaCount + err, { Date: date });
            console.error({ message: 'Could not update eda count.' });
        }
    });
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function updateFilesCollection(edaData) {
    try {
        const update = {
            currentEdaId: edaData._id,
        };
        const doc = await Files.updateOne(
            { _id: edaData.fileId },
            {
                $set: update,
            }
        );
        if (!doc) {
            logger.error('Could not update file' + 'fileId: ' + edaData.fileId, { Date: date });
            console.error({ message: 'Could not update file.' });
        }
    } catch (error) {
        logger.error('Could not update file' + 'fileId: ' + edaData.fileId, { Date: date });
        console.error({ message: 'Could not update file.' });
    }
}

/**
 * List all Projects
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    EdaConfig.find({ projectId: req.project._id }).sort({ 'createdAt': -1 }).limit(1).exec(function (err, project) {
        if (err) {
            logger.error("Could not find projects" + 'projectId: ' + req.project._id, { error: err, Date: date });
            res.status(400).send({ message: "Could not find project" });
        } else {
            res.json(project);
        }
    });
};
exports.edaDone = function (req, res) {
    var edaConf = req.body;
    if (edaConf['status'] == 'failed') {
        logger.error("Eda failed" + 'projectId: ' + req.project._id, { Date: date });
        socket.emit("edaCompleted", { status: 'EDA Failed', edaData: edaConf }, { createdBy: edaConf.createdBy, _id: req.project._id });
        res.send(edaConf);
    } else {
        edaConf.projectId = req.project._id;
        var eda = new EdaConfig(edaConf);
        eda.save(async function (err, edaDoc) {
            if (err) {
                var log = {
                    projectId: req.project._id,
                    userId: req.project.createdBy,
                    level: "error",
                    message: edaConf.edaMode + " Could not save eda result"
                };
                auditLogger.logit(log);
                logger.error("Could not save eda result" + 'projectId: ' + req.project._id, { error: err, Date: date });
                if (res)
                    res.status(400).send({ message: errorHandler.getErrorMessage(err) });
            } else {
                var log = {
                    projectId: req.project._id,
                    userId: req.project.createdBy,
                    level: "info",
                    message: edaConf.edaMode + " eda completed and data saved to database"
                };
                logger.info('Eda completed and data saved to database', { projectId: req.project._id, userId: req.project.createdBy, Date: date });
                auditLogger.logit(log);
                if (req.body.isRetrained && req.body.isNewFile) {
                    //add edaId to files collection
                    await updateFilesCollection(edaDoc);
                } else if (!req.body.hasOwnProperty('isRetrained')) {
                    await updateFilesCollection(edaDoc);
                }
                // var projectStatus = 'Eda Completed';
                updateProjectStatus(req.project);
                if (edaDoc.isMultipleTimeseries) {
                    createTimeseriesGroup(req.body, edaDoc)
                }
                socket.emit("edaCompleted", { status: 'EDA Completed', edaData: edaDoc }, { createdBy: edaConf.createdBy, _id: req.project._id });
                res.send(edaDoc);
            }
        });
    }
}

async function createTimeseriesGroup(req, edaData) {
    try {
        let tsdata = {
            edaId: edaData._id,
            timeseriesGroupList: req.timeseriesGroupList,
            projectId: edaData.projectId,
            createdBy: edaData.createdBy
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
exports.getAdvEdaInfo = function (req, res) {
    var inputParams = {
        currentEdaId: req.query.currentEdaId,
        currentPipelineFilename: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.query.currentPipelineFilename }),
        filename: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.edaSummary.fileId.filename }),
        reportFilePath: req.edaSummary.advEdaReportFilePath ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.edaSummary.advEdaReportFilePath }) : null,
    };
    var options = {
        uri: ps_core_server_url + '/api/eda/pandasProfile',
        method: 'POST',
        json: inputParams
    };
    var log = {
        projectId: req.project._id,
        userId: req.user._id,
        level: "info",
        message: "generating advanced eda details"
    }
    auditLogger.logit(log);
    logger.info('Generated advanced eda details' + log, { Date: date });
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.reportFilePath) {
                EdaConfig.updateOne({ _id: req.edaSummary._id }, {
                    advEdaReportFilePath: body.reportFilePath,
                }, function (err, count) {
                    if (err) {
                        logger.error('Could not update database for eda' + 'projectId: ' + req.project._id + err, { Date: date });
                        res.status(400).send({ message: 'Could not update database for eda' });
                    }
                    // Attach the nonce value for content security policy issue
                    // edaReportNonce - It is a variable which is set from pscore on <script> tag
                    const template = handlebars.compile(body.htmlContent);
                    const reportHTML = template({
                        edaReportNonce: config.app.recaptchaNonce,
                    });
                    res.setHeader('Content-Type', 'text/html');
                    res.send(reportHTML);
                })
            } else {
                // Attach the nonce value for content security policy issue
                // edaReportNonce - It is a variable which is set by pscore on <script> tag
                const template = handlebars.compile(body.htmlContent);
                const reportHTML = template({
                    edaReportNonce: config.app.recaptchaNonce,
                });
                res.setHeader('Content-Type', 'text/html');
                res.send(reportHTML);
            }
        } else {
            logger.error('Error occurred while generating advanced eda details', { projectId: req.project._id, userId: req.user._id, error: error, Date: date });
            res.status(400).send(body);
        }
    });
}

/**
 * Function to download advanced eda report
 */
exports.downloadAdvEdaReport = function (req, res) {
    if (req.edaSummary) {
        res.download(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.edaSummary.advEdaReportFilePath }));
    } else {
        var log = {
            projectId: req.edaSummary.projectId,
            userId: req.edaSummary.createdBy,
            level: "error",
            message: "Could not find edaSummary"
        }
        auditLogger.logit(log);
        logger.error("Could not find edaSummary", { error: err, Date: date });
        res.status(400).send({ message: "Could not find edaSummary" });
    }
}
exports.getFeatureInfo = function (req, res) {
    var featureName = req.body.featureName;
    var featureIndex = -1;
    // var stream = fs.createReadStream(path.resolve(req.body.afterEdaDataFilePath));
    var stream = fs.createReadStream(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.edaSummary.afterEdaDataFilePath }));
    var i = 0;
    var csvData = [];
    var heading = [];
    var obj = {};
    var values = [];
    obj["key"] = featureName;
    var csvStream = csv()
        .on("data", function (row) {
            if (i < 500) {
                if (i == 0) {
                    heading = row;
                    heading.forEach(function (data, indx) {
                        if (data == featureName) {
                            featureIndex = indx;
                        }
                    });
                } else {
                    values.push({ key: featureName, series: 0, x: i, y: row[featureIndex] * 1, y0: 0, y1: row[featureIndex] * 1, size: row[featureIndex] * 1 });
                }
            } else {
                return 0;
            }

            i++;
        })
        .on('close', function () {
        })
        .on("end", function () {
            obj["values"] = values;
            csvData.push(obj);
            var log = {
                projectId: req.project._id,
                userId: req.project.createdBy,
                level: "info",
                message: "Reading eda summary feature data"
            }
            auditLogger.logit(log);
            logger.info('Reading eda summary feature data', { projectId: req.project._id, userId: req.project.createdBy, Date: date })
            return res.json({ status: 'success', graphData: csvData, head: heading });
        });

    stream.pipe(csvStream);
}
/**
 * Function requesting to generate eda graph from ps core
 */
exports.generateEdaGraph = function (req, res) {
    var projectDetails = req.body;
    projectDetails.createdBy = req.user._id;
    projectDetails.projectId = req.project._id;
    projectDetails.fileEncoding = req.project.fileEncoding;
    projectDetails.afterEdaDataFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.edaSummary.afterEdaDataFilePath });
    var options = {
        uri: ps_core_server_url + '/api/eda/graph',
        method: 'GET',
        json: projectDetails
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            logger.info('eda graph generated' + 'projectId: ' + req.project._id, { Date: date });
            res.send(body[0].htmlContent);
        } else {
            logger.error('Could not generate eda graph' + 'projectId: ' + req.project._id, { Date: date });
            res.status(400).send(body);
        }
    });
}
/**
 * Function get Eda Summary
 */
exports.getEdaInfo = function (req, res) {
    if (req.edaSummary) {
        res.json(req.edaSummary);
    } else {
        logger.error('Could not find edaSummary', { Date: date });
        res.status(400).send({ message: "Could not find edaSummary" });
    }
}
/**
 * Function to download edaSummary
 */
exports.downloadEdaSummary = function (req, res) {
    if (req.edaSummary) {
        // res.download(path.resolve(req.edaSummary.imputedDatasetFilepath));
        res.download(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.edaSummary.imputedDatasetFilepath }));
    } else {
        var log = {
            projectId: req.edaSummary.projectId,
            userId: req.edaSummary.createdBy,
            level: "error",
            message: "Could not find edaSummary"
        }
        auditLogger.logit(log);
        logger.error("Could not find edaSummary", { error: err, Date: date });
        res.status(400).send({ message: "Could not find edaSummary" });
    }
}
/**
 * Function to download outlier preview
 */
exports.downloadOutlierPreview = function (req, res) {
    if (req.edaSummary) {
        // res.download(path.resolve(req.edaSummary.outlierPreviewFilepath));
        res.download(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.edaSummary.outlierPreviewFilepath }));

    } else {
        var log = {
            projectId: req.edaSummary.projectId,
            userId: req.edaSummary.createdBy,
            level: "error",
            message: "Could not find outlier preview file"
        };
        auditLogger.logit(log);
        logger.error("Could not find outlier preview file", { error: err, Date: date });
        res.status(400).send({ message: "Could not find outlier preview file" });
    }
};

exports.downloadImputedDataset = function (req, res) {
    // console.log('imputed********************************************', req.edaSummary);
    if (req.edaSummary) {
        // res.download(path.resolve(req.edaSummary.outlierPreviewFilepath));
        res.download(uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.edaSummary.projectId, fileName: req.edaSummary.correctedData !== null ? req.edaSummary.correctedData : req.edaSummary.imputedDatasetFilepath }));

    } else {
        var log = {
            projectId: req.edaSummary.projectId,
            userId: req.edaSummary.createdBy,
            level: "error",
            message: "Could not find outlier preview file"
        };
        auditLogger.logit(log);
        logger.error("Could not find outlier preview file", { error: err, Date: date });
        res.status(400).send({ message: "Could not find outlier preview file" });
    }
};
/**
 * List specified Project
 * @param req
 * @param res
 */
exports.read = function (req, res) {
    res.json(req.strainConfig);
};

/**
 * Update Project configuration
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var project = req.body;
    project.save(function (err) {
        if (err) {
            logger.error("Could not save updated Project Configuration ", { error: err, Date: date });
            if (res)
                return res.status(400).send({ message: "Could not save Project Configutaion" });
            else
                return callback({ message: "Could not save Project Configutaion" });
        } else {
            res.json(project);
        }
    });
};

function updateProjectConf(req, res) {
    var pStatus = "File Uploaded";
    ProjectConfig.updateOne({ _id: req.project._id }, {
        filename: req.file.filename
    }, function (err, affected, resp) {
        if (err) {
            logger.error('Could not update project configuration', { projectId: req.project._id, filename: req.file.filename, Date: date });
            res.status(400).send({ message: "Could not update project Configuration" });
        }
        var stream = fs.createReadStream(destination + req.project._id + "/" + req.file.filename);
        var i = 0;
        var csvData = [];
        var csvStream = csv()
            .on("data", function (row) {
                if (i < 10) {
                    csvData.push(row);
                } else {
                    return 0;
                }
                i++;
            })
            .on("end", function () {
                return res.json({ status: 'success', filename: req.file.filename, id: req.project._id, previewData: csvData });
            });

        stream.pipe(csvStream);
    });
}

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
            logger.error('No project configuration with that identifier has been found' + err, { Date: date });
            return res.status(404).send({ message: "No project Configuration with that identifier has been found" });
        }
        req.project = project;
        next();
    });
};

/**
 * Middleware for finding Eda Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.edaById = function (req, res, next, id) {
    EdaConfig.findById(id).populate('fileId').exec(function (err, edaSummary) {
        if (err) {
            logger.error("Error while finding eda configuration", { error: err, Date: date });
            return next(err);
        } else if (!edaSummary) {
            logger.error('No eda configuration with that identifier has been', { Date: date });
            return res.status(404).send({ message: "No eda Configuration with that identifier has been found" });
        }
        req.edaSummary = edaSummary;
        next();
    });
};

/**
 * Middleware to get eda by edaId for the retrained models
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.findEdaById = function (req, res, next) {
    var edaId = null;
    if (req.body.hasOwnProperty('edaId')) {
        edaId = req.body.edaId;
        if (edaId == 'None') {
            next();
        } else {
            EdaConfig.findById(edaId).populate('fileId').exec(function (err, eda) {
                if (err) {
                    logger.error("Error while finding dbconn data", { error: err, Date: date });
                    return next(err);
                } else if (!eda) {
                    return res.status(404).send({ message: "No Scheduler with that identifier has been found" });
                }
                req.edaData = eda;
                next();
            })
        }
    } else if (req.trainingData.hasOwnProperty('edaId')) {
        edaId = req.trainingData.edaId;
        EdaConfig.findById(edaId).exec(function (err, eda) {
            if (err) {
                logger.error("Error while finding eda details", { error: err, Date: date });
                return next(err);
            }
            else if (!eda) {
                logger.error('No model data with that identifier has been found' + edaId, { Date: date });
                return res.status(404).send({ message: "No model data with that identifier has been found" });
            }
            req.edaData = eda;
            next();
        });

    } else {
        next();
    }
};

/**
 * get eda details by fileId
 * @param {*} req 
 * @param {*} res 
 */
exports.getEdaByFileId = function (req, res) {
    let queryObj;
    if (req.query.fileId !== 'undefined' && req.query.fileId !== 'null') {
        queryObj = { fileId: req.query.fileId, edaMode: 'eda' }
    } else {
        queryObj = { projectId: req.project._id, edaMode: 'eda' }
    }
    EdaConfig.find(queryObj).populate('fileId').sort({ 'createdAt': -1 }).limit(1).exec(function (err, docs) {
        if (err) {
            logger.error('Could not fetch eda' + 'projectId: ' + req.project._id + err, { Date: date })
            return res.status(400).send({ message: 'Could not fetch eda!', err: err });
        }
        res.send(docs);
    })
}

/**
 * Conditional filter
 * @param {*} req 
 * @param {*} res 
 */
exports.getConditionalFilter = function (req, res) {
    inputParams = req.body;
    inputParams.dataset = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.fileName });
    var options = {
        uri: ps_core_server_url + '/api/data/conditional_filterings',
        method: 'POST',
        json: inputParams
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Can not get conditional filter', error, { Date: date });
            res.status(400).send(body);
        }
    });
};

/**
 *  To get target list 
 * @param {*} req 
 * @param {*} res 
 */
exports.getTargetList = function (req, res) {
    dataParams = req.body;
    dataParams.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.filename });
    var options = {
        uri: ps_core_server_url + '/api/eda/target',
        method: 'POST',
        json: dataParams
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Can not get target list', { error: error, Date: date });
            res.status(400).send(body);
        }
    });
};

exports.dateFormatValidator = function (req, res) {
    let data = req.body;
    data.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.filePath });
    var options = {
        uri: ps_core_server_url + '/api/eda/validate_date_format',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Can not get date formate', { error: error, Date: date });
            res.status(400).send(body);
        }
    });
}

exports.multipleTimeseries = function (req, res) {
    let data = req.body;
    data.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.filename });
    var options = {
        uri: ps_core_server_url + '/api/timeseries/multiple/detect_multiple_timeseries',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Can not get multiple timeseries', { error: error, Date: date });
            res.status(400).send(body);
        }
    });
}

exports.resamplingPreview = function (req, res) {
    let data = req.body;
    data.dataset = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.fileName });
    var options = {
        uri: ps_core_server_url + '/api/timeseries/multiple/resampling',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        } else {
            logger.error('Can not preview resampling', { error: error, Date: date });
            res.status(400).send(body);
        }
    });
}

exports.calculateTimeseriesFrequency = function (req, res) {
    let data = {
        datetimeIndex: req.body.datetimeIndex,
        timeseriesIds: req.body.timeseriesIds,
    }
    data.dataset = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.fileName });
    var options = {
        uri: ps_core_server_url + '/api/timeseries/multiple/freq_unidistant',
        method: 'POST',
        json: data
    };
    request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            await updateFrequency(req.body, body);
            res.send(body);
        } else {
            logger.error('Can not preview resampling', { error: error, Date: date });
            res.status(400).send(body);
        }
    });
}

async function updateFrequency(data, frequency) {
    queryObj = { _id: data.selectedDatasetId };
    objIndex = data.fileSchema.findIndex((obj => obj.colName == data.datetimeIndex));
    data.fileSchema[objIndex].frequency = frequency.frequency;
    let reqObj = data.fileSchema;
    Models.findOneAndUpdate(queryObj, { fileSchema: reqObj }, { new: true }, function (err, doc) {
        if (err) {
            logger.error("Could not Update file" + 'error: ' + err, { Date: date });

        } else {
            logger.info("Files Updated", { Date: date });
            // res.send(doc);
        }
    });

}

exports.gettimeseriesGroupList = function (req, res) {
    let queryObj;
    if (req.body.hasOwnProperty('modelId')) {
        queryObj = { modelId: req.body.modelId }
    } else {
        queryObj = { edaId: req.body.edaId }
    }
    timseriesGroup.find(queryObj).exec(function (err, docs) {
        if (err) {
            logger.error('Could not fetch eda' + 'projectId: ' + req.project._id + err, { Date: date })
            return res.status(400).send({ message: 'Could not fetch eda!', err: err });
        }
        res.send(docs);
    })
}