/**
 * Created by Neha on 25/07/20.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
    mongoose = require('mongoose'),
    Output = mongoose.model('Output');
ShareOutput = mongoose.model('ShareOutput')
Apiaccess = mongoose.model('Apiaccess')
multer = require('multer'),
    hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    fs = require('fs');
var _ = require('lodash');
var request = require('request');
var socket = require("../../../../utils/socket/core.socket.utils");
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var config = require("../../../../config/config");
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
UserModule = require('../../../users/server/controllers/admin.server.controller');
var Unzipper = require("decompress-zip");
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var date = Date(Date.now());
date = date.toString();
//***************Output APIs***********************/
/**
 * Middleware for finding output Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataByOutputId = function (req, res, next, id) {
    Output.findById(id).exec(function (err, outputData) {
        if (err) {
            logger.error("Error while finding output" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!outputData) {
            logger.error('No output with that identifier has been found', { Date: date });
            return res.status(404).send({ message: "No output with that identifier has been found" });
        }
        req.outputData = outputData;
        next();
    })
};

//function to insert output data called via notebook
exports.insertReportOutputData = function (req, res) {
    logger.info('Creating output Data', { Date: date });
    var data = req.body;
    delete data._id;
    var outputData = new Output(data);
    outputData.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save Output Data' + ' error: ' + err, { Date: date });
            return res.status(400).send({ message: 'Could not create Report Files details!' });
        }
        else {
            logger.info('Output Data created', { Date: date });
            res.send(doc);
        }
    });
}

//function to delete report
exports.deleteReport = function (req, res) {
    queryObj = { _id: req.outputData._id };
    query = { isDeleted: true };
    Output.updateOne(queryObj, { "$set": query }, function (err, data) {
        if (err) {
            logger.error("Could not delete report" + ' error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not delete report" });
        } else {
            queryobj = { outputId: req.outputData._id };
            quer = { isRemoved: true };
            ShareOutput.updateMany(queryobj, { "$set": quer }, function (error) {
                if (error) {
                    logger.error("Could not unshare report" + ' error: ' + error, { Date: date });
                    res.status(400).send({ message: "Could not unshare report" });
                }
                logger.info("Report unshared" + ' reportid: ' + queryObj, { Date: date });
            })
            logger.info("Report deleted", { Date: date });
            res.send({ message: 'Deleted Report.' });
        }
    })
}

//function to get output list
exports.reportOutputList = function (req, res) {
    queryObj = { projectId: req.project._id, isDeleted: false };
    //res.send(req.ConnectionData)

    Output.find(queryObj, function (err, docs) {
        if (err) {
            logger.error('Could not fetch report files details' + ' error: ' + err, { Date: date });
            return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
        }
        res.send(docs);
    })
};




//***************ShareOutput APIs***********************/
/**
 * Middleware for finding share output Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.shareDataByOutputId = function (req, res, next, id) {
    ShareOutput.findById(id).exec(function (err, shareOutputData) {
        if (err) {
            logger.error("Error while finding files", { error: err, Date: date });
            return next(err);
        } else if (!shareOutputData) {
            logger.error('No file with that identifier has been found', { Date: date });
            return res.status(404).send({ message: "No file with that identifier has been found" });
        }
        req.shareOutputData = shareOutputData;
        next();
    })
};

//function to share report
exports.reportShare = function (req, res) {
    var email = req.body.email;
    var shareoutput = {};
    UserModule.findUserByEmail(email, function (err, user) {
        if (err) {
            logger.error('Could not find any user with that email', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not find any user with that email!.' });
        }
        queryObj = { _id: req.body.testId };
        Output.find(queryObj, function (err, output) {
            if (err) {
                logger.error('Could not fetch Report Files details!', { error: err, Date: date });
                return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
            }
            shareoutput.outputType = output[0].outputType;
            shareoutput.outputId = output[0]._id;
            shareoutput.projectId = output[0].projectId;
            shareoutput.sharedBy = output[0].createdBy;
            shareoutput.sharedTo = user._id;
            var share = new ShareOutput(shareoutput);
            share.save(function (err, doc) {
                if (err) {
                    logger.error('Could not share output', { error: err, Date: date });
                    return res.status(400).send({ message: 'Could not share output', err: err });
                }
                res.send();
            })
        })
    })
}

//function to share output list
exports.shareOutputList = function (req, res) {
    queryObj = { projectId: req.project._id, outputId: req.body.outputId, isRemoved: false };
    ShareOutput.find(queryObj).populate('sharedTo').exec(function (err, docs) {
        if (err) {
            logger.error('Could not fetch Report Files details!', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
        }

        res.send(docs);
    })

}

//function to delete the share access
exports.deleteShareOutput = function (req, res) {
    queryObj = { _id: req.shareOutputData._id };
    ShareOutput.findOneAndUpdate(queryObj, { isRemoved: true }, function (err) {
        if (err) {
            logger.error("Could not remove share output", { error: err, Date: date });
            if (res) {
                res.status(400).send({ message: "Could not remove share output" });
            }
        } else {
            logger.info("Shared output remove", { error: err, Date: date });
            res.send({ message: 'Shared output removed.' });
        }
    });
}

//function to get shared access report
exports.reportOutputListByUser = function (req, res) {
    var word = req.headers.referer;
    var urlWord = word.substr(word.lastIndexOf('/') + -4);
    if (urlWord == 'docs/') {
        var obj = {};
        queryObj = { sharedTo: res.locals.tokenInfo._id, isRemoved: false };
        ShareOutput.find(queryObj).populate('outputId').populate('projectId').exec(function (err, docs) {
            if (err) {
                logger.error('Could not fetch Report Files details!', { error: err, Date: date });
                return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
            }
            var list = docs.filter(function (docs) {
                return docs.projectId.isDeleted == false;
            });
            var outputModified = list.map(
                function (outputs) {
                    return {
                        "outputId": outputs.outputId._id,
                        "name": outputs.outputId.outputName,
                        "description": outputs.outputId.outputDescription,
                        "filename": outputs.outputId.filename,
                    }
                }
            );
            Object.assign(obj, { output: outputModified });
            res.send(obj);
        })
    } else {
        queryObj = { sharedTo: req.user._id, isRemoved: false };
        ShareOutput.find(queryObj).populate('outputId').populate('projectId').exec(function (err, docs) {
            if (err) {
                logger.error('Could not fetch Report Files details!', { error: err, Date: date });
                return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
            }
            var list = docs.filter(function (docs) {
                return docs.projectId.isDeleted == false;
            });
            res.send(list);
        })
    }

}

//function to view report
exports.viewShareReport = function (req, res) {
    var data = req.body
    var queryobj = {};
    var file = data.filename;
    Object.assign(queryobj, { file: file });
    var originalFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: data.filename });
    var contents = fs.readFile(originalFilePath, { encoding: 'base64' }, function (err, data) {
        if (err) {
            logger.error('Could not read the file!', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not read the file!', err: err });
        }
        Object.assign(queryobj, { data: data });
        res.send(queryobj);
    });
};

//function to view report by id
exports.viewShareReportByID = function (req, res) {
    queryObj = { sharedTo: res.locals.tokenInfo._id, isRemoved: false, outputId: req.body.outputId };
    ShareOutput.find(queryObj).populate('outputId').populate('projectId').exec(function (err, docs) {
        if (err) {
            logger.error('Could not fetch Report Files details!', { error: err, Date: date });
            return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
        }
        var list = docs.filter(function (docs) {
            return docs.projectId.isDeleted == false;
        });
        var originalFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: list[0].projectId._id, fileName: list[0].outputId.filename });
        var contents = fs.readFile(originalFilePath, { encoding: 'base64' }, function (err, data) {
            if (err) {
                logger.error('Could not read Files!', { error: err, Date: date });
                return res.status(400).send({ message: 'Could not read the file!', err: err });
            }
            var outputModified = list.map(
                function (outputs) {
                    return {
                        "outputId": outputs.outputId._id,
                        "filename": outputs.outputId.filename,
                        "name": outputs.outputId.outputName,
                        "description": outputs.outputId.outputDescription,
                        "data": data
                    }
                }
            );
            // Object.assign(testobj, { outputModified });
            res.send(outputModified);
        });
    })
};

//function for file preview
module.exports.getPreviewFiles = function (req, res) {
    var isDataTypeRequired = req.query.isDataTypeRequired ? req.query.isDataTypeRequired : false;
    var data = {
        filePath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: req.body.filename }),
        fileExtension: path.extname(req.body.filename),
        fileEncoding: 'utf_8',
    }
    var options = {
        uri: ps_core_server_url + '/api/data/get_preview',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            res.status(400).json(response.body)
        } else {
            res.json(response.body)
        }
    });
}
