/**
 * Created by Saket on 17/10/17.
 */
var path = require('path'),
    logger = require(path.resolve('./logger'))
auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller')
mongoose = require('mongoose'),
    ProjectConfig = mongoose.model('projectConfig'),
    TrainedModel = mongoose.model('trainedModel'),
    Eda = mongoose.model('eda'),
    UddFlow = mongoose.model('UddFlow'),
    AuditLog = mongoose.model('auditLog'),
    EdaProgress = mongoose.model('edaProgress'),
    FeatureRepository = mongoose.model('FeatureRepository'),
    SharedFeature = mongoose.model('SharedFeature'),
    TrainedModelData = mongoose.model('trainedModelData'),
    Files = mongoose.model('Files');
DataGroup = mongoose.model('Datagroup');
User = mongoose.model('User');
Output = mongoose.model('Output');
ShareOutput = mongoose.model('ShareOutput')
ProjectDiscussion = mongoose.model('ProjectDiscussion'),
    multer = require('multer'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    osChecker = require("../../../../utils/general/oschecker.utils.server"),
    UserModule = require('../../../users/server/controllers/admin.server.controller');
csv = require('fast-csv'),
    fs = require('fs'),
    fsx = require('fs-extra')
os = require('os'),
    archiver = require('archiver'),
    rmdir = require('rimraf'),
    config = require("../../../../config/config"),
    _ = require("lodash");
var Unzipper = require("decompress-zip");
var socket = require("../../../../utils/socket/core.socket.utils");
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var destination = './projects/';
//pscore host details
var pscoreHost = require("../../../../config/env/pscore.config");
var Dir = process.env.DATA_DIR || 'projects';
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var pc = this;
passport = require('passport');
var jwt = require("jsonwebtoken");

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {

        if (err || !user) {
            res.status(400).send(info);
        } else {
            userData = {}

            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    var token = jwt.sign(
                        {
                            data: user
                        },
                        'M%Z8XJQv,&Mh4#SF',
                        {
                            expiresIn: 20 * 60
                        }
                    );
                    userData._id = user._id;
                    userData.firstName = user.firstName;
                    userData.lastName = user.lastName;
                    userData.email = user.email;
                    userData.profileImageURL = user.profileImageURL;
                    userData.roles = user.roles;
                    userData.created = user.created;
                    userData.displayName = user.displayName;
                    userData.provider = user.provider;
                    userData.username = user.username;
                    userData.token = token;
                    res.send(userData);
                }
            });
        }
    })(req, res, next);
};

exports.projectlist = function (req, res) {
    ProjectConfig.find({ $or: [{ isDeleted: false }, { sharedWith: req.user._id, isDeleted: false }] }).exec(function (err, project) {
        if (err) {
            logger.error("Could not find projects", { error: err });
            res.status(400).send({ message: "Could not find project" });
        } else {
            res.json(project);
        }
    })
};

exports.datagroup = function (req, res) {
    // queryObj = {
    //     projectId: req.project._id, isDeleted: false
    // };
    queryObj = { isDeleted: false };
    var obj = {};
    Datagroup.find(queryObj, function (err, docs) {
        if (err) {
            res.status(400).send({ message: 'Could not fetch config details!', err: err });
        }
        var DatagroupModified = docs.map(
            function(group) {
                return {
                    "_id": group._id,
                    "name": group.name,
                    "parentId": group.parentId,
                }
            }
        );
        Object.assign(obj, { dataGroup: DatagroupModified });
        res.send(obj);
    });
}

exports.filelist = function (req, res) {
    if (req.body.dataGroupId && req.body.dataGroupId != 'string') {
        queryObj = { dataGroupId: req.body.dataGroupId, isDeleted: false };
    }
    else {
        queryObj = { isDeleted: false };
    }

    var extension = '.pkl'
    if (req.body.fileExtention == '' || req.body.fileExtention == 'string') {
        extension = '.pkl'
    } else {
        extension = req.body.fileExtention
    }

    var obj = {};
    Rawfiles.find(queryObj, function (err, filesdata) {
        filesModified = filesdata.filter(function (e) {
            return path.extname(e.filename).toLowerCase() === extension
        });

        var files = filesModified.map(
            function(cfiles) {
                return {
                    "_id": cfiles._id,
                    "filename": cfiles.filename,
                    "datagroup_id": cfiles.dataGroupId,
                }
            }
        );
        Object.assign(obj, { files: files });
        res.send(obj);
        // prints "The author is Ian Fleming"
    });
}


exports.reportOutputList = function (req, res) {
    var obj = {};
    queryObj = { sharedTo: res.locals.tokenInfo._id, isRemoved: false };
    ShareOutput.find(queryObj).populate('outputId').populate('projectId').exec(function (err, docs) {
        if (err) {
            return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
        }
        var list = docs.filter(function (docs) {
            return docs.projectId.isDeleted == false;
        });
        var outputModified = list.map(
            function(outputs) {
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
}

exports.viewShareReport = function (req, res) {
    var testobj = {};
    queryObj = { sharedTo: res.locals.tokenInfo._id, isRemoved: false, outputId: req.body.outputId };
    ShareOutput.find(queryObj).populate('outputId').populate('projectId').exec(function (err, docs) {
        if (err) {
            return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
        }
        var list = docs.filter(function (docs) {
            return docs.projectId.isDeleted == false;
        });

        var originalFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: list[0].projectId._id, fileName: list[0].outputId.filename });
        var contents = fs.readFile(originalFilePath, { encoding: 'base64' }, function (err, data) {
            if (err) {
                return res.status(400).send({ message: 'Could not read the file!', err: err });
            }
            var outputModified = list.map(
                function(outputs) {
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