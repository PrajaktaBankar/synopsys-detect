/**
 * Created by winjitian.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    Experiments = mongoose.model('taexperiments'),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller')
var socket = require("../../../../utils/socket/core.socket.utils");
var config = require("../../../../config/config");
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var destination = './projects/';
//pscore host details
var pscoreHost = require("../../../../config/env/pscore.config");
var Dir = process.env.DATA_DIR || 'projects';
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var ta_ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.taHost + pscoreHost.hostDetails.taPort;
var request = require('request');
var date = Date(Date.now());
date = date.toString();

module.exports.getFeatureValue = function (req, res) {
    var data = req.query;
    data.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.params.projectId, fileName: data.fileName });
    var feature = {
        featureName: data.featureName,
        filename: data.filename
    }
    var options = {
        uri: ps_core_server_url + '/api/prediction/populate_data',
        method: 'POST',
        json: feature
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not get feature value', { Date: date });
            res.status(400).send(body)
            // reject(body)
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.getExperimentsList = function (req, res) {
    let data = req.project._id;
    Experiments.find({ projectId: data }).exec((err, experiment) => {
        if (err) {
            logger.error('Error while listing Text analysis Experiments ', {
                error: err, Date: date
            });
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(200).json(experiment);
        }
    });
}

module.exports.dotextCleaning = function (req, res) {
    var data = req.body;
    var options = {
        uri: ta_ps_core_server_url + '/api/v1/text_analysis/clean',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete Text cleaning', { Date: date });
            res.status(400).send(body)
            // reject(body)
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.doPos = function (req, res) {
    var data = req.body;
    //setting the abs path of the model as modelPath in the operationparamters
    if (data.taskConfig[0].operationParameters.model != "spacy-en_core_web_sm") {
        data.taskConfig[0].operationParameters.modelPath = path.resolve(data.taskConfig[0].operationParameters.modelPath);
    } else {
        delete data.taskConfig[0].operationParameters.modelPath;
    }
    var options = {
        method: 'POST',
        json: data,
    };
    if (data.renderType == 'table') {
        options.uri = ta_ps_core_server_url + '/api/v1/text_analysis/tag?renderType=table';
    } else {
        options.uri = ta_ps_core_server_url + '/api/v1/text_analysis/tag?renderType=html';
    }
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete POS', { Date: date });
            res.status(400).send(body)
            // reject(body)
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.doNer = function (req, res) {
    var data = req.body;
    //setting the abs path of the model as modelPath in the operationparamters
    if (data.taskConfig[0].operationParameters.model != "spacy-en_core_web_sm") {
        data.taskConfig[0].operationParameters.modelPath = path.resolve(data.taskConfig[0].operationParameters.modelPath);
    } else {
        delete data.taskConfig[0].operationParameters.modelPath;
    }
    var options = {
        method: 'POST',
        json: data
    };
    if (data.renderType == 'table') {
        options.uri = ta_ps_core_server_url + '/api/v1/text_analysis/tag?renderType=table';
    } else {
        options.uri = ta_ps_core_server_url + '/api/v1/text_analysis/tag?renderType=html';
    }
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete NER', { Date: date });
            res.status(400).send(body)
            // reject(body)
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.dowordFrequency = function (req, res) {
    var data = req.body.data;
    if (data.fileName) {
        data.filename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: data.projectId, fileName: data.fileName });
    }
    var options = {
        uri: ta_ps_core_server_url + '/api/v1/text_analysis/word_frequency',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete word frequency', { Date: date });
            res.status(400).send(body);
        } else {
            return res.send({ data: body });
        }
    });
}

//function to call the word embedding api
module.exports.doWordEmbedding = (req, res) => {
    let data = req.body;
    //preparing the requestObject for word embedding api
    let reqObject = {
        uri: ta_ps_core_server_url + '/api/v1/text_analysis/word_embedding',
        method: 'POST',
        json: data
    };
    request(reqObject, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete word embedding', { Date: date });
            res.status(400).send(body);
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.dotextSummarization = function (req, res) {
    var data = req.body;
    var options = {
        uri: ta_ps_core_server_url + '/api/v1/text_analysis/summarization',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete text summarization', { Date: date });
            res.status(400).send(body);
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.doSentimentAnalysis = function (req, res) {
    var data = req.body;
    var options = {
        uri: ta_ps_core_server_url + '/api/v1/text_analysis/sentiment',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete sentiment analysis', { Date: date });
            res.status(400).send(body);
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.doRuleBasedMatch = function (req, res) {
    var data = req.body;
    //setting the abs path of the model as modelPath in the operationparamters
    if (data.taskConfig[0].operationParameters.model != "spacy-en_core_web_sm") {
        data.taskConfig[0].operationParameters.modelPath = path.resolve(data.taskConfig[0].operationParameters.modelPath);
    } else {
        data.taskConfig[0].operationParameters.modelPath = null;
    }
    var options = {
        method: 'POST',
        json: data
    };
    if (data.renderType == 'table') {
        options.uri = ta_ps_core_server_url + '/api/v1/text_analysis/matching?renderType=table';
    } else {
        options.uri = ta_ps_core_server_url + '/api/v1/text_analysis/matching?renderType=html';
    }
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not complete rule based match', { Date: date });
            res.status(400).send(body)
            // reject(body)
        } else {
            return res.send({ data: body });
        }
    });
}

module.exports.saveAnalysis = function (req, res) {
    var data = req.body;
    data.createdBy = req.user._id;
    data.status = 'created';
    var experimentData = new Experiments(data);
    experimentData.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save experiments', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not save experiments!' });
        }
        else {
            logger.info('Experiments saved', { experiemntId: doc._id, Date: date });
            res.send(doc);
        }
    });
}

module.exports.updateAnalysis = function (req, res) {
    let updateData = {
        experimentName: req.body.experimentName,
        taskConfig: req.body.taskConfig,
        fileId: req.body.fileId,
        feature: req.body.feature,
        inputText: req.body.inputText
    };
    Experiments.updateOne({ _id: req.body.experimentId }, { "$set": updateData }, function (err, doc) {
        if (err) {
            logger.error('Unable to update experiments', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not update experiments!' });
        }
        else {
            logger.info('Experiments updated', { experiemntId: doc._id, Date: date });
            res.send('Experiments updated successfully');
        }
    });
}


module.exports.updateApplyAnalysis = function (req, res) {
    let data = req.body;
    let updateData = {
        experimentName: data.experimentName,
        taskConfig: data.operation,
        fileId: data.fileId,
        feature: data.feature,
        inputText: data.inputText
    };
    Experiments.updateOne({ _id: data.experimentId }, { "$set": updateData }, function (err, doc) {
        if (err) {
            logger.error('Unable to update experiments', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not update experiments!' });
        }

        data.taExperimentId = doc._id;
        data.createdBy = req.user._id;
        data.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: data.projectId, fileName: data.filePath });
        if (data.parentPipelineFilename !== null) {
            data.parentPipelineFilename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: data.projectId, fileName: data.parentPipelineFilename });
        }
        var options = {
            uri: ta_ps_core_server_url + '/api/v1/text_analysis/apply',
            method: 'POST',
            json: data
        };
        request(options, function (error, response, body) {
            if (response.statusCode != 200) {
                logger.error('Could not update analysis', { Date: date });
                res.status(400).send(body);
            } else {
                return res.send({ data: body });
            }
        });
    });
}


module.exports.applyAnalysis = function (req, res) {
    var data = req.body;
    var experiemntsData = {
        experimentName: data.experimentName,
        projectId: data.projectId,
        createdBy: req.user._id,
        taskConfig: data.operation,
        status: 'created',
        fileId: data.fileId,
        feature: data.feature,
        inputText: data.inputText
    }
    makeEntryIntoExperiment(experiemntsData).then(function success(resp) {
        data.taExperimentId = resp._id;
        data.createdBy = req.user._id;
        data.filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: data.projectId, fileName: data.filePath });
        if (data.parentPipelineFilename !== null) {
            data.parentPipelineFilename = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: data.projectId, fileName: data.parentPipelineFilename });
        }
        var options = {
            uri: ta_ps_core_server_url + '/api/v1/text_analysis/apply',
            method: 'POST',
            json: data
        };
        //resolving the path and setting it to modelPath.
        data.taskConfig.forEach(config => {
            if (config.operationParameters.model != "spacy-en_core_web_sm" && config.operationParameters.modelPath) {
                config.operationParameters.modelPath = path.resolve(config.operationParameters.modelPath);
            } else if (config.operationParameters.model == "spacy-en_core_web_sm" && config.operationParameters.modelPath) {
                delete config.operationParameters.modelPath;
            }
        });
        request(options, function (error, response, body) {
            if (response.statusCode != 200) {
                logger.error('Could not apply analysis', { Date: date });
                res.status(400).send(body);
            } else {
                return res.send({ data: body });
            }
        });

    }, function error(err) {
        logger.error('Could not create experiments' + data.projectId, { Date: date });
        return res.status(400).send({ message: 'Could not create experiments', err: err });
    });
}

//Function to save Raw Files to db
function makeEntryIntoExperiment(experiments) {
    return Experiments.create(experiments);
}

module.exports.textanalysisDone = function (req, res) {
    var dataToUpdate = { status: req.body.status, taFeatureConfig: req.body.taFeatureConfig };
    Experiments.updateOne({ _id: req.body.taExperimentId }, { "$set": dataToUpdate }, function (err, docs) {
        if (err) {
            logger.error('Could not fetch experiments details', { error: err, Date: date });
            socket.emit("textAnalysisDone", { status: req.body }, { _id: req.body.projectId, createdBy: req.body.createdBy });
            return res.status(400).send({ message: 'Could not fetch experiments details!', err: err });
        }
        socket.emit("textAnalysisDone", { status: req.body }, { _id: req.body.projectId, createdBy: req.body.createdBy });
        res.send(docs);
    });
}

module.exports.deleteExperiment = function (req, res) {
    Experiments.find({ projectId: req.project._id, _id: req.query.experimentId }).deleteOne().then(() => {
        res.status(200).send({ message: 'experiment deleted successfully!' });
    }, err => {
        logger.error('Could not delete experiments', { Date: date });
        return res.status(400).send({ message: 'Could not delete the Experiment', err: err.message });
    });
}
module.exports.findOne = (req, res) => {
    return res.send(req.taExperiments);
}
module.exports.findById = async (req, res, next, id) => {
    try {
        const taExperiments = await Experiments.findById(id);
        req.taExperiments = taExperiments;
        next()
    } catch (error) {
        logger.error('Could not find text analysis with that identifier', { Date: date });
        return res.status(400).send({ message: 'Could not find text analysis with that identifier', err: error })
    }
}