var path = require('path'),
    logger = require(path.resolve('./logger')),
    auditLogger = require('../../../auditlogs/server/controllers/auditlog.server.controller'),
    mongoose = require('mongoose'),
    Files = mongoose.model('Files'),
    EdaConfig = mongoose.model('eda'),
    Trainings = mongoose.model('trainings'),
    Datagroup = mongoose.model('Datagroup'),
    Scheduler = mongoose.model('Scheduler'),
    Rawfiles = mongoose.model('Rawfiles'),
    UddFlow = mongoose.model('UddFlow'),
    Dataconnection = mongoose.model('Dataconnection'),
    Subscription = mongoose.model('subscription'),
    Plans = mongoose.model('plans'),
    dbconn = mongoose.model('DbConn');
multer = require('multer'),
    hideandseek = require(path.resolve('./utils/crypt/hideandseek')),
    errorHandler = require('../../../core/server/controllers/errors.server.controller'),
    fs = require('fs');
var _ = require('lodash');
var date = Date(Date.now());
date = date.toString();
var request = require('request');
var projectController = require("../../../projects/server/controllers/projects.server.controller");
var socket = require("../../../../utils/socket/core.socket.utils");
var pscoreHost = require("../../../../config/env/pscore.config");
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var config = require("../../../../config/config");
var uploadUtil = require('../../../../utils/general/uploader.utils.server');
var Unzipper = require("decompress-zip");
//PSCORE HOST
var ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var folderNameByUser;
const basicSubscription = require('../../../../config/env/plans/basic-subscription');
const proSubscription = require('../../../../config/env/plans/pro-subscription');
var osChecker = require('../../../../utils/general/oschecker.utils.server');
const handlebars = require('handlebars');

//Get all the filesand data group uploaded in for the specified project
module.exports.list = function (req, res) {
    var filter = req.query.filter || null;
    var query = null;
    var obj = {};
    dataGroupQueryObj = {
        projectId: req.project._id, isDeleted: false
    };
    if (filter == 'dataset_with_eda') {
        query = { projectId: req.project._id };
        findFiles(query)
            .then(function (files) {
                //Filter the parent files for which eda is done.
                var data = files.filter(function (file) {
                    if (file.currentEdaId && file.fileSource != 'upload_retrained') {
                        return file;
                    }
                });
                res.send(data);
            }, function (err) {
                logger.error('Error while reading files info!' + query, 'error:' + err, { Date: date });
                return res.status(400).send({ message: 'Error while reading files info!', err: err });
            });
    } else {
        query = { projectId: req.project._id, edaId: null, isDeleted: false };
        Promise.all([findDataGroup(dataGroupQueryObj), findFiles(query)]).then(function (values) {
            var list = values[1];
            Object.assign(obj, { dataGroupList: values[0] });
            var filesModified = values[1].map(function (conns) {
                return {
                    "_id": conns._id,
                    "name": conns.filename,
                    "fileSize": conns.fileSize,
                    "fileSource": conns.fileSource,
                    "datagroup_id": conns.dataGroupId,
                    "noOfRows": conns.noOfRows,
                    "noOfCols": conns.noOfCols,
                    "isDeleted": conns.isDeleted,
                    "createdAt": conns.createdAt,
                    "ProjectId": conns.projectId,
                    "fileSchema": conns.fileSchema,
                    "fileEncoding": conns.fileEncoding,
                    "descriptiveStatistics": conns.descriptiveStatistics,
                    "tasks": conns.tasks,
                    "dataflowId": conns.dataflowId,
                    "taExperimentId": conns.taExperimentId
                }
            }
            );
            Object.assign(obj, { filesList: filesModified });
            res.send([obj]);
        }).catch(function (err) {
            logger.error('Error while reading files info!' + 'userId:' + req.user._id + err, { Date: date });
        });
    }
}

/**
 * Find dataflow by Id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getDataByFlowId = function (req, res) {
    if (req.query.uniqueFlowId) {
        var filesData = Files.find({ uniqueFlowId: req.query.uniqueFlowId }).sort({ createdAt: -1 }).limit(1);
        var rawFilesData = Rawfiles.find({ uniqueFlowId: req.query.uniqueFlowId }).sort({ createdAt: -1 }).limit(1);
        Promise.all([filesData, rawFilesData]).then(function (file) {
            var result = {
                file: {
                    id: file[0][0]._id,
                    filename: file[0][0].filename
                },
                rawfile: {
                    id: file[1][0]._id,
                    filename: file[1][0].filename
                }
            }
            return res.send(result);
        }).catch(function (err) {
            logger.error('Record not found!' + err, { Date: date });
            return res.status(400).send({ message: 'Record not found' });
        });
    } else {
        logger.error('Record not found!' + err, { Date: date });
        return res.status(400).send({ message: 'uniqueFlowId is null or undefined' });
    }
}

/**
 * Get details about a particular file
 * @param req
 * @param res
 */
exports.getFileDetails = function (req, res) {
    return res.send(req.fileData);
};

/**
 * Find files list
 * @param {*} req 
 * @param {*} res 
 */
module.exports.fileList = function (req, res) {
    var filter = req.query.filter || null;
    var query = null;

    var word = req.headers.referer;
    var urlWord = word.substr(word.lastIndexOf('/') + -4);

    if (urlWord == 'docs/') {
        //from swagger
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
            if (err) {
                logger.error('Error while reading files info!' + err, { Date: date });
                return res.status(400).send({ message: 'Error while reading files info!', err: err });
            }
            filesModified = filesdata.filter(function (e) {
                return path.extname(e.filename).toLowerCase() === extension
            });

            var files = filesModified.map(
                function (cfiles) {
                    return {
                        "_id": cfiles._id,
                        "filename": cfiles.filename,
                        "datagroup_id": cfiles.dataGroupId,
                    }
                }
            );
            Object.assign(obj, { files: files });
            res.send(obj);
        });
    } else {
        if (filter == 'dataset_with_eda') {
            query = { projectId: req.project._id };
            findFiles(query)
                .then(function (files) {
                    //Filter the parent files for which eda is done.
                    var data = files.filter(function (file) {
                        var fileId = file._id;
                        return files.some(function (fileData) {
                            return fileId.equals(fileData.parentFileId);
                        });
                    })
                    res.send(data);
                }, function (err) {
                    logger.error('Error while reading files info!' + err, { Date: date });
                    return res.status(400).send({ message: 'Error while reading files info!', err: err });
                })
        } else {
            query = { projectId: req.project._id, edaId: null };
            findFiles(query)
                .then(function (datas) {
                    res.send(datas);
                }, function (err) {
                    logger.error('Error while reading files info!' + err, { Date: date });
                    return res.status(400).send({ message: 'Error while reading files info!', err: err });
                })
        }
    }

}

//find all the required files from files collection 
function findFiles(query) {
    return Files.find(query);
}

//find datagroup
function findDataGroup(query) {
    return Datagroup.find(query);
}

/**
 * upload file
 * @param {*} req 
 * @param {*} res 
 */
module.exports.uploadData = function (req, res) {
    logger.info('upload called!');
    req.projectId = req.project._id;
    checkFileUploadLimit(req).then(function (limitReached) {
        if (limitReached) {
            logger.error('File upload limit reached!' + 'userId:' + req.user._id, { Date: date });
            return res.status(400).send({ message: "File upload limit reached!" });
        } else {
            if (req.query.uploadType === 'importDataset') {
                var ext = path.extname(req.query.fileName);
                var destination = './projects/';
                var sampleDatasetSource = './sampledatasets/';
                if (osChecker.checkOs() == 'windows') {
                    destination = '.\\projects\\';
                    sampleDatasetSource = '.\\sampledatasets\\'
                } else {
                    destination = './projects/';
                    sampleDatasetSource = './sampledatasets/'
                }
                var filename = path.basename(req.query.fileName, ext) + '-' + Date.now() + ext;
                var dest = destination + req.projectId + '/' + filename;
                fs.copyFile(path.resolve(sampleDatasetSource + '/' + req.query.fileName), path.resolve(dest), fs.constants.COPYFILE_EXCL, err => {
                    if (err) {
                        console.log("Error Found:", err);
                        return res.status(400).send(err);
                    }
                    if (!req.file) {
                        // file: {
                        //     fieldname: 'file',
                        //     originalname: 'insurance.csv',
                        //     encoding: '7bit',
                        //     mimetype: 'text/csv',
                        //     destination: '/home/axonfactory/new_predictsense/psstudio/projects/61bc08de3cf6580d99a6db04',
                        //     filename: 'insurance-1640014361115.csv',
                        //     path: '/home/axonfactory/new_predictsense/psstudio/projects/61bc08de3cf6580d99a6db04/insurance-1640014361115.csv',
                        //     size: 58193
                        //   }
                        req.file = {
                            originalname: req.query.fileName,
                            destination: path.resolve(destination + req.projectId),
                            filename: filename,
                            path: path.resolve(dest),
                        }
                        completeUpload(req).then(data => {
                            return res.send(data)
                        }, error => {
                            logger.error('Error occured while uploading file!' + 'userId:' + req.user._id + error, { Date: date });
                            return res.status(400).send(error);
                        });
                    }
                });
            } else {
                uploadUtil.upload(req, res, function (err) {
                    if (err) {
                        var log = {
                            projectId: req.project._id,
                            userId: req.project.createdBy,
                            level: "error",
                            message: "file upload failed"
                        }
                        auditLogger.logit(log);
                        return res.status(400).send(err);
                    }
                    uploadUtil.validationForPsLite(req).then(resText => {
                        completeUpload(req).then(data => {
                            res.send(data)
                        }, error => {
                            logger.error('Error occured while uploading file!' + 'userId:' + req.user._id + error, { Date: date });
                            return res.status(400).send(error);
                        });
                    }, e => {
                        return res.status(400).send({ message: "The number of rows and columns allowed are " + config.uploads.fileUpload.limits.noOfRowsPermitForPsLite + " and " + config.uploads.fileUpload.limits.noOfColsPermitForPsLite + " respectively." });
                    });
                });
            }
        }
    }, function (err) {
        return res.status(400).send(err);
    })
}


/**
 * Function to check the files limit.
 * @param {*} callback 
 */
function checkFileUploadLimit(req) {
    return new Promise(function (resolve, reject) {
        if (config.app.type === 'enterprise') {
            return resolve(false);
        }
        let query;
        let userPlanType;
        if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
            userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
            query = {
                projectId: req?.project?._id,
                createdBy: req?.user?._id
            }
        } else {
            query = {}
        }
        Files.countDocuments(query).exec(function (err, count) {
            if (err) {
                logger.error("Unable to get count of files uploaded. " + 'error: ' + err, { Date: date });
                return resolve(true);
            } else {
                //the request is from ps-lite
                if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin')) {
                    let fileUploadLimit = null;
                    let data = null;
                    Plans.findOne({planType: userPlanType}, function (err, planTemplateData) {
                        if (err){
                            logger.error('Can not add new Plan to the plans collection', { Date: date })
                            return res.status(400).send(err.message);
                        }
                        data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'data');
                        data.rules.find( item => {
                            if(item.name === 'fileuploadlimit'){
                                fileUploadLimit = item.allowedValues;
                            }
                        });
                        return resolve(count >= fileUploadLimit);
                    });
                    // if (userPlanType === "pro") {
                    //     fileUploadLimit = proSubscription.data.fileUpload.limits.uploadLimit;
                    // } else if (userPlanType === "basic") {
                    //     fileUploadLimit = basicSubscription.data.fileUpload.limits.uploadLimit;
                    // }
                } else {
                    return resolve(false);
                }
            }
        });
    })
}

function completeUpload(req) {
    return new Promise(function (resolve, reject) {
        var fType = path.extname(req.file.originalname);
        var fileToSave, insideFolder = null;
        if (fType == '.zip') {
            var filepath = path.join(req.file.destination, req.file.filename);
            var unzipper = new Unzipper(filepath);
            unzipper.on('error', function (err) {
            });

            //Once extraction is completed it will emit this event
            unzipper.on("extract", function (result) {
                //Remove the zip file
                var zipfileToBeDeleted = path.join(req.file.destination, req.file.filename);
                deleteFile(zipfileToBeDeleted, function (err, status) {
                    if (status) {
                        logger.info("File with duplicate column deleted successfully", { Date: date });

                    }
                })
                //Extraction result,loop it and find csv file
                result.forEach(function (item) {
                    if (item.deflated) {
                        fileToSave = item.deflated;
                        return;
                    } else if (item.folder) {
                        insideFolder = item.folder;
                    }
                });
                //Find the filepath  of extracted file
                var extractedFileType = path.extname(fileToSave);
                //Throw error if the extracted folder not contain supported file
                var excludes = ['.csv', '.zip', '.xlsx', '.xls', '.pkl', '.pk', '.pl', '.pickle', '.json', '.html', '.pdf'];
                if (!_.includes(excludes, extractedFileType)) {
                    logger.error("Could not find supported file", { Date: date });
                    reject({ message: "Could not find supported file" });
                }

                //Generating a new filename for extracted file.
                var fName = path.basename(fileToSave)
                var newFileName = req.project._id + Date.now() + fName;
                var finalFileName = newFileName;
                //File to rename
                var pathToRename = req.file.destination + "/" + fileToSave;
                //File name after rename
                var pathToBeSaved = req.file.destination + "/" + finalFileName;
                //Rename the extracted file
                fs.rename(pathToRename, pathToBeSaved, function (err) {
                    if (err) throw reject(err);
                    req.fileToSave = newFileName;
                    req.extractedFolderFilepath = pathToBeSaved;
                    saveFileData(req, function (err, data) {
                        if (err) {
                            logger.error("Error occured while saving the file" + pathToBeSaved, { Date: date });
                            reject(err);
                        }
                        resolve(data);
                    })
                });
            });
            unzipper.extract({ path: 'projects/' + req.project._id });
        } else {

            getDataGroupID(req.project._id).then(function (resp) {
                if (req.params.dataGroupId == 'null' || req.params.dataGroupId == 'string' || req.params.dataGroupId == '{ dataGroupId }' || req.params.dataGroupId == 'undefined') {
                    req.dataGroupId = resp[0]._id;
                    folderNameByUser = resp[0]._id;
                    saveFileData(req, folderNameByUser, function (err, data) {
                        if (err) {
                            logger.error('Error while saving file data' + err, { Date: date });
                            reject(err);
                        }
                        resolve(data);
                    });
                } else {
                    if (req.query.hasOwnProperty('dataFolderName') && req.query.hasOwnProperty('parentFolderName')) {
                        var data = req.body;
                        data.parentId = req.query.parentFolderName;
                        data.name = req.query.dataFolderName;
                        data.projectId = req.project._id;
                        data.createdBy = req.project.createdBy;
                        var datagroup = new Datagroup(data);
                        datagroup.save(function (err, doc) {
                            if (err) {
                                logger.error('Unable to save Data Group: ' + 'error: ' + err, { Date: date });
                                reject({ statusText: 'Unable to save Data Group' });
                            }
                            else {
                                logger.info('Data Group created');
                                req.dataGroupId = doc._id;
                                folderNameByUser = doc._id;
                                saveFileData(req, folderNameByUser, function (err, data) {
                                    if (err) {
                                        logger.error('Error while saving file data' + err, { Date: date });
                                        reject(err);
                                    }
                                    resolve(data);
                                });
                            }
                        });
                    } else {
                        req.dataGroupId = req.params.dataGroupId;
                        folderNameByUser = req.params.dataGroupId;
                        saveFileData(req, folderNameByUser, function (err, data) {
                            if (err) {
                                logger.error('Error while saving file data' + err, { Date: date });
                                reject(err);
                            }
                            resolve(data);
                        });
                    }
                }
            }, function (err) {
                logger.error('Error while saving file data' + err, { Date: date });
            })
        }
    });
}

function getDataGroupID(projectId) {
    return Datagroup.find({ projectId: projectId, parentId: { $exists: false } });
}

function saveFileData(req, fname, callback) {
    var filepath = req.fileToSave ? req.extractedFolderFilepath : req.file.path;

    var filesData = {};

    var encoding = 'utf_8'

    filesData.filename = req.fileToSave ? req.fileToSave : req.file.filename;
    filesData.fileSize = req.file.size;
    filesData.source = req.query.fileSource || 'upload';// prediction
    filesData.projectId = req.project._id;
    filesData.createdBy = req.user._id;
    filesData.fileEncoding = encoding;
    filesData.dataGroupId = fname;

    var filePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: filesData.filename });
    filesData.filePath = filePath;
    filesData.fileEncoding = req.query.encoding;
    // setting the allowed no of rows and cols value to filesData for restriction - only for saas.
    // -1 is for enterprise and super_admin - no restriction for rows and cols.
    filesData.noOfRowsAllowed = -1;
    filesData.noOfColsAllowed = -1;
    if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
        let userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
        let data = null;
        Plans.findOne({planType: userPlanType}, function (err, planTemplateData) {
            if (err){
                logger.error('Can not add new Plan to the plans collection', { Date: date })
                return res.status(400).send(err.message);
            }
            data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'data');
            data.rules.find( item => {
                if(item.name === 'allowednumberofrows'){
                    filesData.noOfRowsAllowed = item.allowedValues;
                }
                if(item.name === 'allowednumberofcolumns'){
                    filesData.noOfColsAllowed = item.allowedValues;
                }
            });
            requestDataPullOrMakeEntryIntoFiles(req, filesData, filePath, callback);
        });
        // if (userPlanType === "pro") {
        //     filesData.noOfRowsAllowed = proSubscription.data.fileUpload.limits.noOfRowsPermitForPro;
        //     filesData.noOfColsAllowed = proSubscription.data.fileUpload.limits.noOfColsPermitForPro;
        // } else if (userPlanType === "basic") {
        //     filesData.noOfRowsAllowed = basicSubscription.data.fileUpload.limits.noOfRowsPermitForBasic;
        //     filesData.noOfColsAllowed = basicSubscription.data.fileUpload.limits.noOfColsPermitForBasic;
        // }
    } else {
        requestDataPullOrMakeEntryIntoFiles(req, filesData, filePath, callback);
    }
}

/**
 * unction to make entry into files collection or request the data pull api for uploading the file.
 * @param {*} req 
 * @param {*} filesData 
 * @param {*} filePath 
 * @param {*} callback 
 */
function requestDataPullOrMakeEntryIntoFiles(req, filesData, filePath, callback){
    //Get the files schema details and update files data
    if (req.query.type == 'prediction') {
        makeEntryIntoFiles(filesData).then(function success(resp) {
            callback(null, { message: 'Saved prediction file data.' })
        }, function error(err) {
            logger.error('Could not save prediction file data!' + err, { Date: date });
            callback({ message: 'Could not save prediction file data!.', err: err })
        })
    } else {
        var options = {
            uri: ps_core_server_url + '/api/data/pull',
            method: 'POST',
            json: filesData
        };
        request(options, function (error, response, body) {
            if (response.statusCode != 200) {
                deleteFile(filePath, function (err, isDelted) {
                    if (err) {
                        logger.error('There is a problem with analysing the data, could not delete the file' + err, { Date: date });
                        callback({ message: 'There is a problem with analysing the data, could not delete the file', err: err })

                    } else {
                        logger.error('There is a problem with analysing the data, could not delete the file' + err, { Date: date });
                        callback({ message: 'There is a problem with analysing the data, deleted the file', err: err })
                    }
                })
            } else {
                // res.send({message:'Started pulling data.'})
                logger.info('Analysing the data.' + filesData, { Date: date });
                callback(null, { message: 'Analysing the data.' })
            }
        });
    }
}


/**
 * Delete uploaded file
 */
function deleteFile(filepath, callback) {
    fs.unlink(path.resolve(filepath), function (err, data) {
        if (err) {
            logger.error("Could not delete file with duplicate column name " + 'error: ' + err, { Date: date });
        }
        callback(null, true);
    });
}

//function to save DataConnection to db
function makeEntryIntoDataConnetion(connsData) {
    // deleting the scheduleId key if it is none.
    (connsData.scheduleId === 'None') && delete connsData.scheduleId;
    var dataconnection = new Dataconnection(connsData);
    return dataconnection.save();
}

//Function to save Raw Files to db
async function makeEntryIntoRawFiles(rawData) {
    return await Rawfiles.create(rawData);
}

//Function to save data to db
async function makeEntryIntoFiles(data) {
    return await Files.create(data);
}
/**
 * Function to find the duplicate columns in the csv header
 * @param header,pass the csv header
 * @returns {Array}
 */
function filterDuplicateCoumn(header) {
    var duplicate = _.filter(header, function (value, index, iteratee) {
        return _.includes(iteratee, value, index + 1);
    });
    return duplicate;
}
/**
 * Function read the data from csv
 */
function readDataFromCsv(filepath, callback) {
    var stream = fs.createReadStream(filepath);
    var csvStream = csv()
    var onData;
    var rows = [];
    onData = function (row) {
        rows.push(row);
        if (rows.length == 10) {
            csvStream.emit('doneReading'); //custom event
        }
    }
    csvStream.on("data", onData).on("doneReading", function () {
        stream.close();
        csvStream.removeListener('data', onData);
        callback(null, rows)
    })
    csvStream.on("end", function () {

    });
    stream.pipe(csvStream);
    // callback(null,rows)
}

//Function to get schema about a file
function getFileSchema(data, callback) {
    var options = {
        uri: ps_core_server_url + '/api/data/get_schema',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Error getting schema' + error, { Date: date });
            callback({ message: 'error getting schema' }, null)
        } else {
            callback(null, response.body)
        }
    });
}


function constructPath(tasks, params) {
    tasks.forEach(function (item) {
        item.currentPipelineFilename = item.currentPipelineFilename ? uploadUtil.costructAbsPath({ baseDir: params.baseDir, projectId: params.projectId, fileName: item.currentPipelineFilename }) : null;
        item.parentPipelineFilename = item.parentPipelineFilename ? uploadUtil.costructAbsPath({ baseDir: params.baseDir, projectId: params.projectId, fileName: item.parentPipelineFilename }) : null;
    })
    return tasks;

}

//Function merge data
module.exports.mergeData = function (req, res) {
    var data = req.body;
    data.projectId = req.project._id;
    data.createdBy = req.user._id;
    data.parentDatasetTasks = constructPath(data.parentDatasetTasks, { baseDir: config.projectDir, projectId: req.project._id });
    data.mergeDatasetTasks = constructPath(data.mergeDatasetTasks, { baseDir: config.projectDir, projectId: req.project._id });
    // data['parentPipelineFilename'] = data['parentPipelineFilename'] ? uploadUtil.costructAbsPath({baseDir:config.projectDir,projectId:req.project._id,fileName:data['parentPipelineFilename']}):null;
    data.originalFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: data.originalFilePath });
    data.mergeFilePath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: data.mergeFilePath });
    var options = {
        uri: ps_core_server_url + '/api/data/merge',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Error while merging the data' + response.body + error, { Date: date });
            res.status(400).send(response.body)
        } else {
            res.send(response.body)

        }
    });
}
/**
 * function to get data preview of dataset 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getPreviewData = function (req, res) {
    var isDataTypeRequired = req.query.isDataTypeRequired ? req.query.isDataTypeRequired : false;
    var data = {
        filePath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.fileData.filename }),
        fileExtension: path.extname(req.fileData.filename),
        fileEncoding: req.fileData.fileEncoding,
        numRows: req.query.numRows || 5
    }

    var options = {
        uri: ps_core_server_url + '/api/data/get_preview',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Error getting preview data' + error, { Date: date });
            res.status(400).json(response.body)
        } else {
            res.json(response.body)
        }
    });
}
/**
 * Function to delete a single file
 */
module.exports.deleteFile = function (req, res) {
    var fileToDelete = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.fileData.filename });
    Files.deleteOne({ _id: req.fileData._id })
        .then(function () {
            fs.unlink(path.resolve(fileToDelete), function () {
                logger.info('File deleted successfully' + + 'projectId' + req.project._id);
                var edaData = EdaConfig.deleteMany({ fileId: req.fileData._id }).exec();
                var trainingsData = Trainings.deleteMany({ originalFileId: req.fileData._id }).exec();
                Promise.all([edaData, trainingsData]).then(function (files) {
                    logger.info('Eda and training deleted for the file ' + 'fileId: ' + req.fileData._id, { Date: date });
                }).catch(function (err) {
                    logger.error('Could not update file details' + 'error: ' + err, { Date: date });
                    return res.status(400).send({ message: 'Could not update the file details' });
                });
                res.send({ message: 'File deleted successfully!' })
            });
        }, function () {
            logger.info('File deleted successfully' + 'projectId: ' + req.project._id, { Date: date });
            res.status(400).send({ message: 'Could not delete file!.' });
        })
}
/**
 * Function to delete multiple files
 */
module.exports.deleteAllFile = function (req, res) {
    var data = req.body.data;
    for (var i = 0; i < data.length; i++) {
        var fileToDelete = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.pid, fileName: data[i].name });
        Files.deleteOne({ _id: data[i]._id }).then(function () {
            fs.unlink(path.resolve(fileToDelete), function () {
                logger.info('File deleted successfully' + 'projectId:' + req.body.pid, { Date: date });
            });
        }, function (err) {
            logger.error('Could not delete file!' + 'projectId' + req.body.pid + 'error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not delete file!.' });
        })
    }
    res.send({ message: 'File deleted successfully!' })
}

exports.queryDb = function (req, res) {
    res.send({ message: 'success' })
}
/**
 * Function will pass url to pscore and it will start pulling the data
 */
exports.pullData = function (req, res) {
    req.user.isEnabled && checkFileUploadLimit(req).then(function (limitReached) {
        if (limitReached) {
            logger.error('File upload limit reached!' + 'userId:' + req.user._id, { Date: date });
            return res.status(400).send({ message: "File upload limit reached!" });
        } else {
            var data = req.body;
            if (
              data.source === 'mssql' ||
              data.source === 'mysql' ||
              data.source === 'postgresql' ||
              data.source === 'sftp' ||
              data.source === 'snowflake'
            ) {
              const key = hideandseek.keyFromPassword();
              data.connection.password = hideandseek.decrypt(key, data.connection.password);
            }
            if (data.source === 's3') {
              const key = hideandseek.keyFromPassword();
              data.connection.awsSecretKey = hideandseek.decrypt(key, data.connection.awsSecretKey);
            }
            if (data.source === 'bigquery') {
              const key = hideandseek.keyFromPassword();
              data.connection.bqPrivateKey = hideandseek.decrypt(key, data.connection.bqPrivateKey);
              data.connection.bqPrivateKey = data.connection.bqPrivateKey.replace(/\\n/g, '\n');
            }

            data.projectId = req.project._id;
            data.createdBy = req.user._id;
            data.fileEncoding = 'utf_8';
            data.dataGroupId = data.dataGroupId;

            if (data.source !== 'upload') {
                data.connectionName = data.connectionName;
                if (data.source != 'url') {
                  if (data.source === 's3') {
                    data.s3ConnectionId = data.connection._id;
                    data.fileExtension = data.fileExtension;
                    data.bucketFolderPath = data.bucketFolderPath;
                    data.lastFetch = '';
                  }
                  if (data.source !== 's3') {
                    data.databaseName = data.database;
                    data.folderPath = data.folderpath;
                    data.address = data.connection.address;
                    data.port = data.connection.port;
                    data.username = data.connection.username;
                    data.password = data.connection.password;
                    data.createdBy = data.connection.createdBy;
                    data.path = data.folderPath;
                    data.fileExtension = data.fileExtension;

                    if (data.source != 'sftp') {
                      data.databaseConnectionId = data.connection._id;
                    } else {
                      data.sftpConnectionId = data.connection._id;
                      data.lastFetch = '';
                    }
                  }
                }

                if (data.parent_id) {
                    var Group = {};
                    Group.projectId = req.project._id;
                    Group.createdBy = req.user._id;
                    Group.parentId = data.parent_id;
                    Group.name = data.dataGroupName;
                    data.dataGroupId = data.parent_id;
                    var datagroup = new Datagroup(Group);
                    datagroup.save(function (err, doc) {
                        if (err) {
                            logger.error('Could not create data group' + 'error: ' + err, { Date: date });
                            return res.status(400).send({ message: 'Could not create data group', err: err });
                        } else {
                            data.dataGroupId = doc._id;
                            makeEntryIntoDataConnetion(data).then(function success(resp) {
                                data.dataConnId = resp._id;
                                if (data.isPulling) {
                                    makePullRequest(data, req).then(function (success) {
                                        if (data.hasOwnProperty('scheduleId')) {
                                            var scheduler = req.scheduler;
                                            scheduler.tasks = scheduler.tasks.concat([{ taskType: 'dataConnection', taskId: resp._id }]);
                                            return scheduler.save();
                                        } else {
                                            logger.info('Started pulling data.' + 'userId: ' + Group.createdBy + 'projectId: ' + Group.projectId, { Date: date })
                                            return res.send({ message: 'Started pulling data.' })
                                        }
                                    }, function (err) {
                                        logger.error('Failed pulling data' + err, { Date: date })
                                        return res.status(400).send({ message: 'Failed pulling data.' + err })
                                    }).then(function () {
                                        logger.info('Task saved to scheduler task list' + 'projectId: ' + req.project._id + 'scheduler: ' + req.scheduler, { Date: date })
                                        return res.send({ message: 'Task saved to scheduler task list' })
                                    }, function (err) {
                                        logger.error('Could not save the tasks to scheduler' + 'projectId:' + req.project._id + 'schedulerId:' + req.scheduler, { Date: date })
                                        return res.status(400).send({ message: 'Could not save the tasks to scheduler', err: err });
                                    });
                                } else {
                                    if (data.hasOwnProperty('scheduleId')) {
                                        var scheduler = req.scheduler;
                                        scheduler.tasks = scheduler.tasks.concat([{ taskType: 'dataConnection', taskId: resp._id }]);
                                        return scheduler.save();
                                    }
                                    res.send(resp);
                                }
                            }, function error(err) {
                                logger.error('Task saved to scheduler task list' + 'projectId:' + req.project._id + 'schedulerId:' + req.scheduler, { Date: date })
                                return res.status(400).send({ message: 'Could not create a connection', err: err });
                            });
                        }

                    });
                } else {
                    makeEntryIntoDataConnetion(data).then(function success(resp) {
                        data.dataConnId = resp._id;
                        if (data.isPulling) {
                            makePullRequest(data, req).then(function (success) {
                                if (data.hasOwnProperty('scheduleId')) {
                                    var scheduler = req.scheduler;
                                    scheduler.tasks = scheduler.tasks.concat([{ taskType: 'dataConnection', taskId: resp._id }]);
                                    return scheduler.save();
                                } else {
                                    logger.info('Started pulling data', { Date: date });
                                    return res.send({ message: 'Started pulling data.' })
                                }
                            }, function (err) {
                                logger.error('Failed pulling data' + err, { Date: date });
                                return res.status(400).send({ message: 'Failed pulling data.', err: err })
                            }).then(function () {
                                return res.send({ message: 'Task saved to scheduler task list' })
                            }, function (err) {
                                logger.error('Could not save the tasks to scheduler' + err, { Date: date })
                                return res.status(400).send({ message: 'Could not save the tasks to scheduler', err: err });
                            });
                        } else {
                            if (data.hasOwnProperty('scheduleId')) {
                                var scheduler = req.scheduler;
                                scheduler.tasks = scheduler.tasks.concat([{ taskType: 'dataConnection', taskId: resp._id }]);
                                scheduler.save();
                            }
                            res.send(resp);
                        }
                    }, function error(err) {
                        logger.error('Could not create a connection' + err, { Date: date })
                        return res.status(400).send({ message: 'Could not create a connection', err: err });
                    });
                }
            } else {
                makePullRequest(data, req).then(function (success) {
                    logger.info('Started pulling data.')
                    res.send({ message: 'Started pulling data.' })
                }, function (err) {
                    logger.error('Failed pulling data' + err, { Date: date })
                    res.status(400).send({ message: 'Failed pulling data.', err: err })
                })
            }
        }
    }, function (err) {
        return res.status(400).send(err);
    })
}

// Pulls data for single connection
exports.pullSingleData = function (req, res) {
    checkFileUploadLimit(req).then(function (limitReached) {
        if (limitReached) {
            logger.error('File upload limit reached!' + 'userId:' + req.user._id, { Date: date });
            return res.status(400).send({ message: "File upload limit reached!" });
        } else {
            Dataconnection.find({ _id: req.params.connectionId }).populate('databaseConnectionId').populate('sftpConnectionId').populate('s3ConnectionId').exec(function (err, doc) {
                connObj = {
                    isPulling: doc[0].isPulling ? doc[0].isPulling : '',
                    connectionName: doc[0].connectionName,
                    query: doc[0].query ? doc[0].query : '',
                    createdBy: doc[0].createdBy,
                    createdAt: doc[0].createdAt,
                    lastFetch: doc[0].lastFetch,
                    dataGroupId: doc[0].dataGroupId,
                    database: doc[0].databaseName,
                    dataConnId: doc[0]._id,
                    source: doc[0].source,
                    dataFormat: doc[0].dataFormat ? doc[0].dataFormat : '',
                    projectId: doc[0].projectId,
                    url: doc[0].url ? doc[0].url : '',
                    fileEncoding: 'utf_8',
                    dataflowId: doc[0].dataflowId,
                    folderPath: doc[0].folderPath ? doc[0].folderPath : '',
                    fileExtension: doc[0].fileExtension ? doc[0].fileExtension : '',
                    databaseConnectionId: doc[0].databaseConnectionId ? doc[0].databaseConnectionId._id : '',
                    sftpConnectionId: doc[0].sftpConnectionId ? doc[0].sftpConnectionId._id : '',
                    password: doc[0].sftpConnectionId ? doc[0].sftpConnectionId.password : '',
                    connection: {
                        source: doc[0].databaseConnectionId ? doc[0].databaseConnectionId.source : '',
                        password: doc[0].sftpConnectionId ? doc[0].sftpConnectionId.password : '',
                    },
                }

                if (doc[0].source === 'mssql' || doc[0].source === 'mysql' || doc[0].source === 'postgresql' || doc[0].source === 'sftp') {
                    connObj.address = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.address : doc[0].sftpConnectionId.address;
                    connObj.username = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.username : doc[0].sftpConnectionId.username;
                    connObj.port = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.port : doc[0].sftpConnectionId.port;
                    connObj.connection.port = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.port : doc[0].sftpConnectionId.port;
                    connObj.connection.createdAt = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.createdAt : doc[0].sftpConnectionId.createdAt;
                    connObj.connection.createdBy = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.createdBy : doc[0].sftpConnectionId.createdBy;
                    connObj.connection.username = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.username : doc[0].sftpConnectionId.username;
                    connObj.connection.name = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.name : doc[0].sftpConnectionId.name;
                    connObj.connection.address = doc[0].databaseConnectionId ? doc[0].databaseConnectionId.address : doc[0].sftpConnectionId.address;
                    const key = hideandseek.keyFromPassword();
                    connObj.connection.password = hideandseek.decrypt(key, doc[0].databaseConnectionId ? doc[0].databaseConnectionId.password : doc[0].sftpConnectionId.password);
                    //! pscore access the password key from connection object also and sometimes from outside connection object 
                    //! Will need to refactor it    
                    connObj.password = hideandseek.decrypt(key, doc[0].databaseConnectionId ? doc[0].databaseConnectionId.password : doc[0].sftpConnectionId.password);
                }
                if(doc[0].source === 's3'){
                    connObj.connection = doc[0].s3ConnectionId;
                    connObj.bucket = doc[0].bucket;
                    connObj.bucketFolderPath = doc[0].bucketFolderPath;
                    const key = hideandseek.keyFromPassword();
                    connObj.connection.awsSecretKey = hideandseek.decrypt(key, doc[0].s3ConnectionId.awsSecretKey);
                }
                if(doc[0].source === 'snowflake'){       
                    connObj.connection = doc[0].databaseConnectionId;
                    const key = hideandseek.keyFromPassword();
                    connObj.connection.password = hideandseek.decrypt(key, doc[0].databaseConnectionId.password);
                }
                if(doc[0].source === 'bigquery'){       
                    connObj.connection = doc[0].databaseConnectionId;
                    const key = hideandseek.keyFromPassword();
                    connObj.connection.bqPrivateKey = hideandseek.decrypt(key, doc[0].databaseConnectionId.bqPrivateKey);
                    connObj.connection.bqPrivateKey = connObj.connection.bqPrivateKey.replace(/\\n/g,'\n')
                }

                makePullRequest(connObj, req).then(function (success) {
                    logger.info('Started pulling data.', { Date: date })
                    res.send({ message: 'Started pulling data.' })
                }, function (err) {
                    logger.error('Failed pulling data' + err, { Date: date })
                    res.status(400).send({ message: 'Failed pulling data.', err: err })
                })
            });
        }
    }, function (err) {
        return res.status(400).send(err);
    })
}

function makePullRequest(data, req) {
    return new Promise(function (resolve, reject) {
        // setting the allowed no of rows and cols value to data for restriction - only for saas.
        // -1 is for enterprise and super_admin - no restriction for rows and cols.
        data.noOfRowsAllowed = -1;
        data.noOfColsAllowed = -1;
        if (config.app.type === 'saas' && !req.user?.roles?.includes('super_admin') && !req.user?.roles?.includes('admin') && req.subscription) {
            let userPlanType = !req?.subscription?.planType && req?.subscription?.isFreeTrial ? 'pro' : req?.subscription?.planType;
            let planData;
            Plans.findOne({planType: userPlanType}, function (err, planTemplateData) {
                if (err){
                    logger.error('Can not add new Plan to the plans collection', { Date: date })
                    return res.status(400).send(err.message);
                }
                planData = planTemplateData.restrictionPlans.find(val => val.moduleName === 'data');
                planData.rules.find( item => {
                    if(item.name === 'allowednumberofrows'){
                        data.noOfRowsAllowed = parseInt(item.allowedValues);
                    }
                    if(item.name === 'allowednumberofcolumns'){
                        data.noOfColsAllowed = parseInt(item.allowedValues);
                    }
                });
                var options = {
                    uri: ps_core_server_url + '/api/data/pull',
                    method: 'POST',
                    json: data
                };
                request(options, function (error, response, body) {
                    if (response.statusCode != 200) {
                        reject(body)
                    } else {
                        resolve(body)
                    }
                });
            });
            // if (userPlanType === "pro") {
            //     data.noOfRowsAllowed = proSubscription.data.fileUpload.limits.noOfRowsPermitForPro;
            //     data.noOfColsAllowed = proSubscription.data.fileUpload.limits.noOfColsPermitForPro;
            // } else if (userPlanType === "basic") {
            //     data.noOfRowsAllowed = basicSubscription.data.fileUpload.limits.noOfRowsPermitForBasic;
            //     data.noOfColsAllowed = basicSubscription.data.fileUpload.limits.noOfColsPermitForBasic;
            // }
        } else {
            var options = {
                uri: ps_core_server_url + '/api/data/pull',
                method: 'POST',
                json: data
            };
            request(options, function (error, response, body) {
                if (response.statusCode != 200) {
                    reject(body)
                } else {
                    resolve(body)
                }
            });
        }
    })
}
/**
 * Will be triggred from pscore once the pull data from URL is completed.
 */
// exports.pullDataDone = function (req, res) {
//     var filesData = req.body;
//     var uddParams = {};
//     var lastfetch;
//     if (filesData.files) {
//         var file = filesData.files;
//         var name = file[0].fileSource;
//     }
//     if ((name == 'merge' || name == 'eda_' || name == 'textAnalysis') && filesData.status != 'failed') {
//         makeEntryIntoFiles(filesData.files).then(function (success, data) {
//             if (name == 'merge') {
//                 socket.emit("merge", { status: 'pull_success', data: filesData }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.info('Data saved successfully' + 'userId:' + filesData.createdBy + 'projectId' + filesData.projectId, { Date: date });
//             } else if (name == 'eda_') {
//                 socket.emit("eda", { status: 'pull_success', data: filesData }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.info('Data saved successfully' + 'userId:' + filesData.createdBy + 'projectId' + filesData.projectId, { Date: date });
//             } else if (name == 'textAnalysis') {
//                 socket.emit("textAnalysis", { status: 'pull_success', data: filesData }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.info('Data saved successfully' + 'userId:' + filesData.createdBy + 'projectId' + filesData.projectId, { Date: date });
//             }
//             res.send({ message: 'Data saved successfully' });
//         }, function (err) {
//             if (name == 'merge') {
//                 socket.emit("merge", { status: "db_update_failed", projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.error('Failed to save data' + err + 'userId' + filesData.createdBy + 'projectId' + filesData.projectId, { Date: date })
//             } else if (name == 'eda_') {
//                 socket.emit("eda", { status: "db_update_failed", projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.error('Failed to save data' + err + 'userId' + filesData.createdBy + 'projectId' + filesData.projectId, { Date: date })
//             } else if (name == 'textAnalysis') {
//                 socket.emit("textAnalysis", { status: "db_update_failed", projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.error('Failed to save data' + err + 'userId' + filesData.createdBy + 'projectId' + filesData.projectId, { Date: date })
//             }
//             res.status(400).send({ message: 'Failed to save data!', err: err });
//         });
//     } else if (filesData.status != 'failed') {     
//         if (filesData.parsed && filesData.files) {
//          makeEntryIntoFiles(filesData.files).then(function (success, data) {
//                 logger.info('Data saved successfully' + 'userId: ' + filesData.createdBy + 'projectId: ' + filesData.projectId, { Date: date });
//                 res.send({ message: 'Data saved successfully', fileId: success[0]._id });
//             }, function (err) {
//                 logger.error('Failed to save data' + 'userId: ' + filesData.createdBy + 'projectId: ' + filesData.projectId + err, { Date: date });
//                 res.status(400).send({ message: 'Failed to save data!', err: err });
//             }); 
//         }
//         if (filesData.rawFiles) {
//             filesData.rawFiles.forEach(element => {
//                 element['parsed'] = filesData.parsed;
//                 element['message'] = filesData.message;
//             });
//              makeEntryIntoRawFiles(filesData.rawFiles).then(function (success) {
//                 socket.emit("pullData", { status: 'pull_success', data: filesData }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 var rawfilesData = filesData.rawFiles;
//                 if (rawfilesData.length) {
//                     console.log('🚀 ~ rawfilesData[0].dataConnId --->', rawfilesData[0].dataConnId);
//                     Dataconnection.find({ _id: rawfilesData[0].dataConnId }, function (err, datas) {
//                         console.log('🚀 ~ err --->', err);
//                         console.log('🚀 ~ datas --->', datas);
//                         if (err) {
//                             logger.error('Could not find data' + 'userId: ' + filesData.createdBy + 'projectId: ' + filesData.projectId + err, { Date: date })
//                             return res.status(400).send({ message: 'Could not find data!', err: err });
//                         }
//                         lastfetch = datas.lastFetch;
//                     });
//                 }
//                 if (filesData.lastFetch != null) {
//                     var query = { lastFetch: filesData.lastFetch };
//                     Dataconnection.updateOne({ _id: rawfilesData[0].dataConnId }, { "$set": query }, function (err, datas) {
//                         if (err) {
//                             logger.error('Could not update data' + 'userId: ' + filesData.createdBy + 'projectId: ' + filesData.projectId + err, { Date: date })
//                             return res.status(400).send({ message: 'Could not update!', err: err });
//                         }
//                     })
//                 }
//                 if (filesData.dataflowId) {
//                     var queryObj = { _id: filesData.dataflowId }
//                     UddFlow.find(queryObj, function (err, flow) {
//                         if (err) {
//                             logger.error('Could not fetch report files details!' + 'error: ' + err, { Date: date });
//                             return res.status(400).send({ message: 'Could not fetch Report Files details!', err: err });
//                         }
//                         for (var i = 0; i < rawfilesData.length; i++) {
//                             uddParams = {};
//                             uddParams.uniqueFlowId = flow[0]._id.toString();
//                             uddParams.createdBy = filesData.createdBy;
//                             uddParams.flowId = flow[0].flowId;
//                             uddParams.projectId = filesData.projectId;
//                             uddParams.dataGroupId = rawfilesData[i].dataGroupId;
//                             uddParams.dataConnId = rawfilesData[i].dataConnId;
//                             uddParams.lastFetch = lastfetch;
//                             uddParams.filename = rawfilesData[i].filename;
//                             var name = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: filesData.projectId });
//                             uddParams.basedir = name.replace('undefined', '');
//                             uddParams.filepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: filesData.projectId, fileName: rawfilesData[i].filename });
//                             uddFlowExecuter(uddParams);
//                         }
//                     })
//                 }
//                 logger.info('Started pulling data' + 'userId: ' + filesData.createdBy + 'projectId: ' + filesData.projectId, { Date: date })
//                 return res.send({ message: 'Started pulling data.',fileId: success[0]._id })
//             }, function (err) {
//                 socket.emit("pullData", { status: "db_update_failed", projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//                 logger.error('Failed to save data' + 'userId: ' + filesData.createdBy + 'projectId: ' + filesData.projectId + err, { Date: date });
//                 res.status(400).send({ message: 'Failed to save data!', err: err });
//             });
//         }else{
//             socket.emit("pullData", { status: filesData.message, projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//             return res.status(400).send({ message: filesData.message });  
//         } 
//     } else {
//         if (filesData.source == 'merge') {
//             socket.emit("merge", { status: filesData.message, projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//             logger.error('Failed to save data' + 'error: ' + filesData.message + 'userId: ' + filesData.createdBy + 'projectId:' +
//                 filesData.projectId, { Date: date })
//             return res.status(400).send({ message: filesData.message });

//         } else {
//             socket.emit("pullData", { status: filesData.message, projectId: filesData.projectId }, { _id: filesData.projectId, createdBy: filesData.createdBy });
//             logger.error('Failed to save data' + 'error: ' + filesData.message + 'userId: ' + filesData.createdBy + 'projectId:' +
//                 filesData.projectId, { Date: date })
//             return res.status(400).send({ message: filesData.message });
//         }
//     }
// }

//Function to update a file in files collection
// ! REFACTORED THE ABOVE PULL DONE API, NEEDS TO BE TESTED THROUGHLY
exports.pullDataDone = async function (req, res) {
  let filesData = req.body;
  if (filesData.files) {
    var file = filesData.files;
    var name = file[0].fileSource;
  }
  if (
    (name == 'merge' || name == 'eda_' || name == 'textAnalysis') &&
    filesData.status != 'failed'
  ) {
    makeEntryIntoFiles(filesData.files).then(
      function (success, data) {
        if (name == 'merge') {
          socket.emit(
            'merge',
            { status: 'pull_success', data: filesData },
            { _id: filesData.projectId, createdBy: filesData.createdBy }
          );
          logger.info(
            'Data saved successfully' +
              'userId:' +
              filesData.createdBy +
              'projectId' +
              filesData.projectId,
            { Date: date }
          );
        } else if (name == 'eda_') {
          socket.emit(
            'eda',
            { status: 'pull_success', data: filesData },
            { _id: filesData.projectId, createdBy: filesData.createdBy }
          );
          logger.info(
            'Data saved successfully' +
              'userId:' +
              filesData.createdBy +
              'projectId' +
              filesData.projectId,
            { Date: date }
          );
        } else if (name == 'textAnalysis') {
          socket.emit(
            'textAnalysis',
            { status: 'pull_success', data: filesData },
            { _id: filesData.projectId, createdBy: filesData.createdBy }
          );
          logger.info(
            'Data saved successfully' +
              'userId:' +
              filesData.createdBy +
              'projectId' +
              filesData.projectId,
            { Date: date }
          );
        }
        res.send({ message: 'Data saved successfully' });
      },
      function (err) {
        if (name == 'merge') {
          socket.emit(
            'merge',
            { status: 'db_update_failed', projectId: filesData.projectId },
            { _id: filesData.projectId, createdBy: filesData.createdBy }
          );
          logger.error(
            'Failed to save data' +
              err +
              'userId' +
              filesData.createdBy +
              'projectId' +
              filesData.projectId,
            { Date: date }
          );
        } else if (name == 'eda_') {
          socket.emit(
            'eda',
            { status: 'db_update_failed', projectId: filesData.projectId },
            { _id: filesData.projectId, createdBy: filesData.createdBy }
          );
          logger.error(
            'Failed to save data' +
              err +
              'userId' +
              filesData.createdBy +
              'projectId' +
              filesData.projectId,
            { Date: date }
          );
        } else if (name == 'textAnalysis') {
          socket.emit(
            'textAnalysis',
            { status: 'db_update_failed', projectId: filesData.projectId },
            { _id: filesData.projectId, createdBy: filesData.createdBy }
          );
          logger.error(
            'Failed to save data' +
              err +
              'userId' +
              filesData.createdBy +
              'projectId' +
              filesData.projectId,
            { Date: date }
          );
        }
        res.status(400).send({ message: 'Failed to save data!', err: err });
      }
    );
  } else if (filesData.status != 'failed') {
    if (filesData.rawFiles) {
      filesData.rawFiles.forEach((element) => {
        element['parsed'] = filesData.parsed;
        element['message'] = filesData.message;
      });
    } else {
      socket.emit(
        'pullData',
        { status: filesData.message, projectId: filesData.projectId },
        { _id: filesData.projectId, createdBy: filesData.createdBy }
      );
      return res.status(400).send({ message: filesData.message });
    }
    const [makeEntryIntoFilesData, makeEntryIntoRawFilesData] = await Promise.allSettled([
      filesData.parsed && filesData.files && (await makeEntryIntoFiles(filesData.files)),
      filesData.rawFiles && (await makeEntryIntoRawFiles(filesData.rawFiles)),
    ]);
    if (makeEntryIntoFilesData.status === 'rejected') {
      socket.emit(
        'pullData',
        { status: 'db_update_failed', projectId: filesData.projectId },
        { _id: filesData.projectId, createdBy: filesData.createdBy }
      );
      logger.error(
        'Failed to save files data' +
          'userId: ' +
          filesData.createdBy +
          'projectId: ' +
          filesData.projectId +
          makeEntryIntoFilesData.reason,
        { Date: date }
      );
      // res.status(400).send({ message: 'Failed to save data!', err: makeEntryIntoFilesData });
    }
    if (makeEntryIntoRawFilesData.status === 'rejected') {
      socket.emit(
        'pullData',
        { status: 'db_update_failed', projectId: filesData.projectId },
        { _id: filesData.projectId, createdBy: filesData.createdBy }
      );
      logger.error(
        'Failed to save raw files data' +
          'userId: ' +
          filesData.createdBy +
          'projectId: ' +
          filesData.projectId +
          makeEntryIntoRawFilesData.reason,
        { Date: date }
      );
      // res.status(400).send({ message: 'Failed to save data!', err: makeEntryIntoRawFilesData });
    }
    socket.emit(
      'pullData',
      { status: 'pull_success', data: filesData },
      { _id: filesData.projectId, createdBy: filesData.createdBy }
    );
    const { err: docsError, message: docsMsg } = await pullDataDoneUtils(
      filesData.rawFiles,
      filesData
    );
    logger.info(
      'Started pulling data' +
        'userId: ' +
        filesData.createdBy +
        'projectId: ' +
        filesData.projectId,
      { Date: date }
    );
    docsError
      ? res.send({ message: docsMsg || 'Failed to save data' })
      : res.send({
          message: 'Data saved successfully',
          fileId: makeEntryIntoFilesData.value[0]._id || makeEntryIntoRawFilesData.value[0]._id,
        });
  } else {
    if (filesData.source == 'merge') {
      socket.emit(
        'merge',
        { status: filesData.message, projectId: filesData.projectId },
        { _id: filesData.projectId, createdBy: filesData.createdBy }
      );
      logger.error(
        'Failed to save data' +
          'error: ' +
          filesData.message +
          'userId: ' +
          filesData.createdBy +
          'projectId:' +
          filesData.projectId,
        { Date: date }
      );
      return res.status(400).send({ message: filesData.message });
    } else {
      socket.emit(
        'pullData',
        { status: filesData.message, projectId: filesData.projectId },
        { _id: filesData.projectId, createdBy: filesData.createdBy }
      );
      logger.error(
        'Failed to save data' +
          'error: ' +
          filesData.message +
          'userId: ' +
          filesData.createdBy +
          'projectId:' +
          filesData.projectId,
        { Date: date }
      );
      return res.status(400).send({ message: filesData.message });
    }
  }
};

// ! REQUIRED IN PULL DATA DONE API AFTER REFACTOR
/**
 * Perform few operations related to pull data done API
 * @param {*} rawfilesData 
 * @param {*} filesData 
 * @returns 
 */
async function pullDataDoneUtils(rawfilesData, filesData) {
  let lastfetch;
  let uddParams = {};
  try {
    // No need to execute this block for retraining
    if (rawfilesData[0].fileSource !== 'upload_retrained' && rawfilesData.length) {
      const doc = await Dataconnection.find({ _id: rawfilesData[0].dataConnId });
      if (!doc.length) {
        logger.error(
          `Could not find data - userId: ${filesData.createdBy} - projectId: ${filesData.projectId} - Date: ${date}}`
        );
        return { err: true, message: 'Could not find data' };
      } else {
        lastfetch = doc.lastFetch;
      }
    }
    if (filesData.lastFetch != null) {
      var query = { lastFetch: filesData.lastFetch };
      const doc = await Dataconnection.updateOne(
        { _id: rawfilesData[0].dataConnId },
        { $set: query }
      );
      if (!doc) {
        logger.error(
          'Could not update data' +
            'userId: ' +
            filesData.createdBy +
            'projectId: ' +
            filesData.projectId +
            doc,
          { Date: date }
        );
        // return { err: true, message: doc || 'Could not update data' };
      }
    }
    if (filesData.dataflowId) {
      var queryObj = { _id: filesData.dataflowId };
      const doc = await UddFlow.find(queryObj);
      if (!doc) {
        logger.error('Could not fetch report files details!' + 'error: ' + doc, { Date: date });
        // return { err: true, message: doc || 'Could not find data flow' };
      } else {
        logger.info(
          'Started pulling data' +
            'userId: ' +
            filesData.createdBy +
            'projectId: ' +
            filesData.projectId,
          { Date: date }
        );
        for (var i = 0; i < rawfilesData.length; i++) {
          uddParams.uniqueFlowId = doc[0]._id.toString();
          uddParams.createdBy = filesData.createdBy;
          uddParams.flowId = doc[0].flowId;
          uddParams.projectId = filesData.projectId;
          uddParams.dataGroupId = rawfilesData[i].dataGroupId;
          uddParams.dataConnId = rawfilesData[i].dataConnId;
          uddParams.lastFetch = lastfetch;
          uddParams.filename = rawfilesData[i].filename;
          var name = uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: filesData.projectId,
          });
          uddParams.basedir = name.replace('undefined', '');
          uddParams.filepath = uploadUtil.costructAbsPath({
            baseDir: config.projectDir,
            projectId: filesData.projectId,
            fileName: rawfilesData[i].filename,
          });
          uddFlowExecuter(uddParams);
        }
      }
    }
    return { err: false, message: "Activities perform sucessfully" };
  } catch (error) {
    return { err: true, message: error.message || error.msg || 'Uncaught exception' };
  }
}

exports.updateData = function (req, res) {
    //prepared the data to update for file and rawfile
    var filedata = {
        fileSize: req.body.files[0].fileSize,
        noOfRows: req.body.files[0].noOfRows,
        noOfCols: req.body.files[0].noOfCols,
        fileSchema: req.body.files[0].fileSchema,
        descriptiveStatistics: req.body.files[0].descriptiveStatistics,
        tasks: req.body.files[0].tasks
    }
    var rawfiledata = {
        fileSize: req.body.rawFiles[0].fileSize
    }
    //query to update the file details
    var filesData = Files.findOneAndUpdate({ _id: req.body.files[0].fileId }, filedata).exec();
    var rawFilesData = Rawfiles.findOneAndUpdate({ _id: req.body.rawFiles[0].rawFileId }, rawfiledata).exec();
    Promise.all([filesData, rawFilesData]).then(function (files) {
        res.status(200).send();
    }).catch(function (err) {
        logger.error('Could not update file details' + ' error: ' + err, { Date: date });
        return res.status(400).send({ message: 'Could not update the file details' });
    });
}

//Function to trigger API to generate report using pandas profiling
exports.advDataReport = function (req, res) {
    var inputParams = {
        filename: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.fileData.filename }),
        reportFilePath: req.fileData['fileReportFilename'] ? uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.fileData.fileReportFilename }) : null,
    }
    var options = {
        uri: ps_core_server_url + '/api/eda/pandasProfile',
        method: 'POST',
        json: inputParams
    };
    var log = {
        projectId: req.project._id,
        userId: req.user._id,
        level: "info",
        message: "generating advanced report for data file"
    }
    auditLogger.logit(log);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (!req.fileData['fileReportFilename']) {
                var fileObj = req.fileData;
                fileObj.fileReportFilename = body.reportFilePath;
                updateFile(fileObj).then(
                  function (success) {
                    // Attach the nonce value for content security policy issue
                    // edaReportNonce - It is a variable which is assigned by pscore team on scrip tag 
                    const template = handlebars.compile(body.htmlContent);
                    const reportHTML = template({
                      edaReportNonce: config.app.recaptchaNonce,
                    });
                    res.setHeader('Content-Type', 'text/html');
                    res.send(reportHTML);
                  },
                  function (err) {
                    logger.error('Could not update database' + 'projectId: ' + req.project._id + 'userId: ' + req.user._id, { Date: date });
                    res.status(400).send({ message: 'Could not update database' });
                  }
                );
            } else {
                // Attach the nonce value for content security policy issue
                // edaReportNonce - It is a variable which is assigned by pscore team on scrip tag 
                const template = handlebars.compile(body.htmlContent);
                const reportHTML = template({
                  edaReportNonce: config.app.recaptchaNonce,
                });
                res.setHeader('Content-Type', 'text/html');
                res.send(reportHTML);
                // res.send(body.htmlContent)
            }

        } else {
            res.status(400).send(body)
        }
    });
}
//Function to fetch all the child datasets for the selected parent
exports.getChildDatasets = function (req, res) {
    Files.find({ projectId: req.project._id, _id: req.fileData._id }).populate({ path: 'currentEdaId' })
        .then(function (datas) {
            logger.info('Data read successfully ' + ' projectId: ' + req.project._id + ' filesId: ' + req.fileData._id, { Date: date });
            res.send(datas);
        }, function (err) {
            logger.error('Error while reading files info ' + ' projectId: ' + req.project._id + ' filesId: ' + req.fileData._id + err, { Date: date });
            return res.status(400).send({ message: 'Error while reading files info!', err: err });
        })
}
//Update files collection
function updateFile(fileObj) {
    return fileObj.save();
}
/**
 * Middleware for finding files Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataById = function (req, res, next, id) {
    Files.findById(id).exec(function (err, fileData) {
        if (err) {
            logger.error("Error while finding files" + 'error:' + err, { Date: date });
            return next(err);
        } else if (!fileData) {
            logger.error('No file with that identifier has been found' + 'error: ' + err);
            return res.status(404).send({ message: "No file with that identifier has been found" });
        }
        req.fileData = fileData;
        next();
    })
};


/**
 * Middleware for finding a particular file
 * @param req
 * @param res
 * @param next
 */
exports.findOne = function (req, res, next) {
    if (req.body.hasOwnProperty('reTrainFileId') || req.query['reTrainFileId']) {
        var fileId = req.body.reTrainFileId || req.query['reTrainFileId']
        if (fileId) {
            Files.findById(fileId).exec(function (err, fileData) {
                if (err) {
                    logger.error("Error while finding files" + 'error:' + err, { Date: date });
                    return next(err);
                } else if (!fileData) {
                    return res.status(404).send({ message: "No file with that identifier has been found" });
                }
                req.fileData = fileData;
                next();
            })
        } else {
            next();
        }
    } else {
        next();
    }

};

// Finding notebook's input file details
exports.findNotebookInputFile = function (req, res, next) {
    if (req.query.notebookInputFileId) {
        Files.findOne({ _id: req.query.notebookInputFileId }).exec(function (err, fileData) {
            if (err) {
                logger.error("Error while finding files" + 'error:' + err, { Date: date });
                return next(err);
            } else if (!fileData) {
                return res.status(404).send({ message: "No file with that identifier has been found" });
            }
            req.notebookInputFile = fileData;
            next();
        })
    } else {
        next();
    }
};

exports.findOneAndUpdate = function (req, res, next) {
    var data = req.body[0];
    if (req.query.type == 'retraining') {
        var reTrainFileId = data.reTrainFileId;
        data['modelMetaData'][0].reTrainFileId = data.reTrainFileId;
        var update = {
            xHoldout: data.xHoldout,
            yHoldout: data.yHoldout,
            xTrain: data.xTrain,
            yTrain: data.yTrain,
            xDev: data.xDev,
            yDev: data.yDev,
            trainPipeFilePath: data.trainPipeFilePath
        }
        //isDataSplitted-true/false -indicates xHoldout,yHoldout,xTrain,yTrain etc are generated or not.
        if (req.body[0].isDataSplitted) {
            Files.findByIdAndUpdate(reTrainFileId, { $set: { reTrainingData: update } }, function (err, doc) {
                if (err) {
                    logger.error('Failed to save retraining information' + 'error:' + err, { Date: date });
                    req.body = { projectStatus: 'Failed to save retraining information', algoName: data['algoName'] };
                }
                next();
            })
        } else {
            next();
        }

    } else {
        next();
    }
}


//***************Data Group APIs****************************/
/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataGroupdataById = function (req, res, next, id) {
    Datagroup.findById(id).exec(function (err, DataGroupData) {
        if (err) {
            logger.error("Error while finding files" + 'error: ' + err, { Date: date });
            return next(err);
        } else if (!DataGroupData) {
            logger.error('No file with that identifier has been found' + 'error: ' + err, { Date: date });
            return res.status(404).send({ message: "No file with that identifier has been found" });
        }
        req.DataGroupData = DataGroupData;
        next();
    })
};

//Function to Insert Data Group
exports.insertDataGroup = function (req, res) {
    logger.info('Creating Data Group' + 'createdBy: ' + req.user._id, { Date: date });
    var data = req.body;
    data.createdBy = req.user_id;
    var datagroup = new Datagroup(data);
    datagroup.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save Data Group' + 'error: ' + err, { Date: date });
            res.status(400).send({ statusText: 'Unable to save Data Group' });
        }
        else {
            logger.info('Data Group created', { Date: date });
            res.send(doc);
        }
    });
}

/**
 * This function is used to List the Data Group
 * @param {*} req 
 * @param {*} res 
 */
exports.DataGroupList = function (req, res) {
    queryObj = { projectId: req.project._id, isDeleted: false };
    Datagroup.find(queryObj, function (err, docs) {
        if (err) {
            res.status(400).send({ message: 'Could not fetch config details!', err: err });
        }
        logger.info('Data Group list fetched', { Date: date });
        res.send(docs);
    })
}

//Function to List Data Group
/**
 * This function is used to List the AllData Group 
 * @param {*} req 
 * @param {*} res 
 */
exports.allData = function (req, res) {
    queryObj = {
        projectId: req.project._id, isDeleted: false
    };
    var obj = {};
    Datagroup.find(queryObj, function (err, docs) {
        if (err) {
            logger.error('Could not fetch config details' + 'projectId: ' + req.project._id + 'error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not fetch config details!', err: err });
        }
        Dataconnection.find(queryObj).populate('scheduleId').exec(function (err, connections) {
            if (err) return handleError(err);
            Rawfiles.find(queryObj, function (err, filesdata) {
                Object.assign(obj, { datagroupList: docs });
                var ConnectionModified = connections.map(
                    function (conns) {
                        return {
                            "_id": conns._id,
                            "name": conns.connectionName,
                            "type": conns.source,
                            "last_fetch": conns.lastFetch,
                            "datagroup_id": conns.dataGroupId,
                            "schedule_id": conns.scheduleId,
                            "updatedAt": conns.updatedAt,
                            "isDeleted": conns.isDeleted,
                            "createdAt": conns.createdAt,
                            "dataflowId": conns.dataflowId,
                        }
                    }
                );
                Object.assign(obj, { connection: ConnectionModified });

                var filesModified = filesdata.map(
                    function (cfiles) {
                        return {
                            "_id": cfiles._id,
                            "name": cfiles.filename,
                            "type": cfiles.fileSource,
                            "last_fetch": '',
                            "datagroup_id": cfiles.dataGroupId,
                            "schedule_id": '',
                            "updatedAt": cfiles.updatedAt,
                            "isDeleted": cfiles.isDeleted,
                            "createdAt": cfiles.createdAt,
                            "connId": cfiles.dataConnId,
                            "parsed": cfiles.parsed,
                            "message": cfiles.message
                        }
                    }
                );
                Object.assign(obj, { filesdata: filesModified });
                Files.find(queryObj, function (err, file) {
                    var pklFiles = file.map(function (pklfile) {
                        return {
                            "_id": pklfile._id,
                            "name": pklfile.filename,
                            "type": pklfile.fileSource,
                            "datagroup_id": pklfile.dataGroupId,
                            "isDeleted": pklfile.isDeleted,
                            "createdAt": pklfile.createdAt,
                        }
                    })
                    Object.assign(obj, { pklfilesdata: pklFiles });
                    logger.info('Details about files,rawfiles,dataconnections and data group found', { Date: date });
                    res.send([obj]);
                });

            })
        });
    });
}

/**
 * This function is used to find the single datagroup 
 * @param {*} req 
 * @param {*} res 
 */
exports.datagroupfindOne = function (req, res) {
    var data = req.DataGroupData;
    res.send(data);
}

//Function to Delete Data Group
/**
 * Fuction is used to Delete the Data Group
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteDataGroup = function (req, res) {
    var dataGroup = [];
    dataGroup = req.query.datagroup;
    var dataconnection = req.query.dataconnection;
    var rawFiles = req.query.rawFiles;
    var files = req.query.files;
    if (typeof (req.query.dataconnection) == 'string') {
        var dataconnection = dataconnection.split();
    }
    if (typeof (req.query.datagroup) == 'string') {
        var dataGroup = dataGroup.split();
    }
    if (typeof (req.query.rawFiles) == 'string') {
        var rawFiles = rawFiles.split();
    }
    if (typeof (req.query.files) == 'string') {
        var files = files.split();
    }
    var dataGroup = dataGroup.map(JSON.parse);
    if (dataconnection !== undefined) {
        var dataconnection = dataconnection.map(JSON.parse);
        for (var i = 0; i < dataconnection.length; i++) {
            Dataconnection.updateOne(
                { _id: dataconnection[i]._id },
                {
                    $set: {
                        isDeleted: true
                    },
                }
            ).then(
                function (data) {
                    logger.info("Data connection deleted." + 'dataConnectionId: ' + data._id);
                },
                function (err) {
                    logger.error("Could not delete Data connection" + 'error:' + err, { Date: date });
                    res.status(400).send({ message: "Could not delete Data connection" });
                }
            );
            if (dataconnection[i].schedule_id) {
                var dataId = dataconnection[i]._id;
                Scheduler.findById(dataconnection[i].schedule_id._id, function (err, doc) {
                    if (err) {
                        logger.error('Could not find task' + err, { Date: date });
                        return res.status(400).send({ message: 'Could not find task' });
                    }
                    var task = doc.tasks.filter(function (item) {
                        return item.taskId == dataId;
                    });
                    doc.tasks.id(task[0]._id).remove();
                    doc.save(function (err, scheduler) {
                        if (err) {
                            logger.error('Could not remove task from scheduler' + err, { Date: date })
                            return res.status(400).send({ message: 'Could not remove task from scheduler' });
                        }
                    })
                })
            }
        }
    }
    for (var i = 0; i < dataGroup.length; i++) {
        Datagroup.updateOne(
            { _id: dataGroup[i]._id },
            {
                $set: {
                    isDeleted: true
                },
            }
        ).then(
            function (data) {
                logger.info("Data Group deleted.", { Date: date });
            },
            function (err) {
                logger.error("Could not delete Data Group" + 'error: ' + err, { Date: date });
                res.status(400).send({ message: "Could not delete Data Group" });
            }
        );
    }
    if (rawFiles !== undefined) {
        var rawFiles = rawFiles.map(JSON.parse);
        for (var i = 0; i < rawFiles.length; i++) {
            var rdataId = rawFiles[i]._id;
            var fileToDelete = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: rawFiles[i].name });
            Rawfiles.deleteOne({ _id: rawFiles[i]._id })
                .then(function () {
                    fs.unlink(path.resolve(fileToDelete), function () {
                        logger.info('Files deleted successfully' + rdataId, { Date: date });
                    });
                }, function () {
                    logger.error('Could not delete file' + 'error: ' + err, { Date: date });
                    res.status(400).send({ message: 'Could not delete file!.' });
                })
        }
    }
    if (files !== undefined) {
        var files = files.map(JSON.parse);
        for (var i; i < files.length; i++) {
            var fileToDelete = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: files[i].name });
            Files.deleteOne({ _id: files[i]._id })
                .then(function () {
                    fs.unlink(path.resolve(fileToDelete), function () {
                        logger.info('File deleted successfully' + 'projectId: ' + req.project._id, { Date: date });
                    });
                }, function () {
                    logger.info('Could not delete file!' + 'projectId: ' + req.project._id, { Date: date });
                    res.status(400).send({ message: 'Could not delete file!.' });
                })
        }
    }
    res.send({ message: 'Data Group deleted.' });
}

// Used only for migrated (Angular 10) code
// Function to Delete Data Group
exports.deleteDataGroupV2 = function (req, res) {
    var dataGroup = req.body.datagroup;
    var dataconnection = req.body.dataconnection;
    var rawFiles = req.body.rawFiles;
    var files = req.body.files;

    if (dataconnection) {
        for (var i = 0; i < dataconnection.length; i++) {
            Dataconnection.updateOne(
                { _id: dataconnection[i]._id },
                {
                    $set: {
                        isDeleted: true,
                    },
                }
            ).then(
                function (data) {
                    logger.info("Data connection deleted." + 'dataConnectionId:' + data._id, { Date: date });
                },
                function (err) {
                    logger.error("Could not delete Data connection" + 'error: ' + err, { Date: date });
                    res.status(400).send({ message: "Could not delete Data connection" });
                }
            );
            if (dataconnection[i].schedule_id) {
                var dataId = dataconnection[i]._id;
                Scheduler.findById(
                    dataconnection[i].schedule_id._id,
                    function (err, doc) {
                        if (err) {
                            logger.error("Could not find task" + err, { Date: date });
                            return res.status(400).send({ message: "Could not find task" });
                        }
                        var task = doc.tasks.filter(function (item) {
                            return item.taskId == dataId;
                        });
                        doc.tasks.id(task[0]._id).remove();
                        doc.save(function (err, scheduler) {
                            if (err) {
                                logger.error("Could not remove task from scheduler" + err, { Date: date });
                                return res
                                    .status(400)
                                    .send({ message: "Could not remove task from scheduler" });
                            }
                        });
                    }
                );
            }
        }
    }
    for (var i = 0; i < dataGroup.length; i++) {
        Datagroup.updateOne(
            { _id: dataGroup[i]._id },
            {
                $set: {
                    isDeleted: true,
                },
            }
        ).then(
            function (data) {
                logger.info("Data Group deleted.");
            },
            function (err) {
                logger.error("Could not delete Data Group" + 'error: ' + err, { Date: date });
                res.status(400).send({ message: "Could not delete Data Group" });
            }
        );
    }

    if (rawFiles) {
        for (var i = 0; i < rawFiles.length; i++) {
            var rdataId = rawFiles[i]._id;
            var fileToDelete = uploadUtil.costructAbsPath({
                baseDir: config.projectDir,
                projectId: req.project._id,
                fileName: rawFiles[i].name,
            });
            Rawfiles.deleteOne({ _id: rawFiles[i]._id }).then(
                function () {
                    fs.unlink(path.resolve(fileToDelete), function () {
                        logger.info("Raw Files deleted successfully" + 'projectId' + req.project._id + 'rawfileId: ' + rdataId, { Date: date });
                    });
                },
                function () {
                    logger.error("Could not delete raw file" + 'projectId' + req.project._id + 'error: ' + err, { Date: date });
                    res.status(400).send({ message: "Could not delete raw file!." });
                }
            );
        }
    }
    if (files) {
        for (var i = 0; i < files.length; i++) {
            var fileToDelete = uploadUtil.costructAbsPath({
                baseDir: config.projectDir,
                projectId: req.project._id,
                fileName: files[i].name,
            });
            Files.deleteOne({ _id: files[i]._id }).then(
                function () {
                    fs.unlink(path.resolve(fileToDelete), function () {
                        logger.info("File deleted successfully" + ' projectId: ' + req.project._id, { Date: date });
                    });
                },
                function () {
                    logger.info("Could not delete file!" + ' projectId: ' + req.project._id, { Date: date });
                    res.status(400).send({ message: "Could not delete file!." });
                }
            );
        }
    }
    res.send({ message: "Data Group deleted." });
};

/**
 * This function is used to Update the Data Group
 * @param {*} req 
 * @param {*} res 
 */
exports.updateDataGroup = function (req, res) {
    queryObj = { _id: req.body._id };
    Datagroup.findOneAndUpdate(queryObj, { "$set": req.body }, function (err) {
        if (err) {
            logger.error("Could not Update Data Group" + 'error: ' + err, { Date: date });
            if (res) {
                res.status(400).send({ message: "Could not Update Data Group" });
            }
        } else {
            logger.info("Data Group Update", { Date: date });
            res.send({ message: 'Update Data Group.' });
        }
    });
}

//***********************************************************/

//***************Data Connection APIs***********************/
/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataByConnId = function (req, res, next, id) {
    Dataconnection.findById(id).exec(function (err, dataConns) {
        if (err) {
            logger.error("Error while finding files" + ' error: ' + err, { Date: date });
            return next(err);
        } else if (!dataConns) {
            logger.error('No file with that identifier has been found' + 'error: ' + err, { Date: date });
            return res.status(404).send({ message: "No file with that identifier has been found" });
        }
        req.dataConns = dataConns;
        next();
    })
};

// List all the data connections
exports.listAllDataConnections = function (req, res) {
    Dataconnection.find({ projectId: req.params.projectId, source: req.params.source }).populate("databaseConnectionId").exec(function (err, docs) {
        if (err) {
            logger.error('Could not fetch raw files details' + ' error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not fetch data connections list!', err: err });
        }
        logger.info('Data connections list founded' + req.project._id, { Date: date });
        res.send(docs);
    })
}

//function to add data connections
exports.updateDataConnection = function (req, res) {
    var query = req.body;
    queryObj = { _id: req.body._id };
    var connection = req.body;
    connection = _.extend(req.dataConns, req.body);
    if (query.statusData == 'None') {
        Scheduler.findById(query.oldScheduleId, function (err, doc) {
            if (err) {
                logger.error('Could not find task' + 'error: ' + err, { Date: date });
                return res.status(400).send({ message: 'Could not find task' });
            }
            var task = doc?.tasks.filter(function (item) {
                return item.taskId.equals(req.dataConns._id);
            });
            //.log(doc.tasks);
            doc?.tasks.id(task[0]._id).remove();
            doc.save(function (err, scheduler) {
                if (err) {
                    logger.error('Could not remove task from scheduler' + 'error: ' + err, { Date: date });
                    return res.status(400).send({ message: 'Could not remove task from scheduler' });
                }
            })
        })
        connection.scheduleId = undefined;
    }
    connection.save(function (err) {
        if (err) {
            logger.error("Could not Update Data Connection" + 'error: ' + err, { Date: date });
            return res.status(400).send({ message: "Could not Update Data Connection" });
        } else {
            if (query.scheduledata !== 'noupdate') {
                if (query.statusData !== 'None') {
                    if (query.scheduledata == 'update') {
                        Scheduler.findById(query.oldScheduleId, function (err, doc) {
                            if (err) {
                                logger.error('Could not find task' + 'error: ' + err, { Date: date });
                                return res.status(400).send({ message: 'Could not find task' });
                            }
                            var task = doc.tasks.filter(function (item) {
                                return item.taskId.equals(req.dataConns._id);
                            });
                            //.log(doc.tasks);
                            doc.tasks.id(task[0]._id).remove();
                            doc.save(function (err, scheduler) {
                                if (err) {
                                    logger.error('Could not remove task from scheduler' + 'error: ' + err, { Date: date });
                                    return res.status(400).send({ message: 'Could not remove task from scheduler' });
                                }
                            })
                        })
                    }
                    var scheduler = req.scheduler;
                    if (scheduler) {
                        scheduler.tasks = scheduler.tasks.concat([{ taskType: 'dataConnection', taskId: req.body._id }]);
                        scheduler.save();
                    }
                }
            }
            logger.info("Data Connection Update", { Date: date });
            res.send({ message: 'Update Data Connection.' });
        }
    });
}


//Function to Delete Data Connection
exports.deleteDataConnection = function (req, res, next) {
    queryObj = { _id: req.params.connectionId };
    Dataconnection.findOneAndUpdate(queryObj, { isDeleted: true, '$unset': { 'dataflowId': 1 } }, function (err) {
        if (err) {
            logger.error("Could not delete Data Connection" + 'error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not delete Data Connection" });
        } else {
            logger.info("Data Connection deleted", { Date: date });
            if (req.dataConns.dataflowId) {
                deleteFlow(req.dataConns);
            }
            if (req.dataConns.scheduleId) {
                req.taskId = req.dataConns._id;
                req.scheduleId = req.dataConns.scheduleId;
                next()
            } else {
                logger.info("Data Connections deleted" + 'dataconnectionId: ' + req.dataConns._id, { Date: date });
                res.send({ message: 'Deleted Data Connection.' });
            }
        }
    });
}
function deleteFlow(data) {
    UddFlow.findOneAndDelete({ _id: data.dataflowId }, function (err, docs) {
        if (err) {
            logger.error("Could not delete Data flow" + 'error: ' + err, { Date: date });
            res.status(400).send({ message: "Could not delete Data flow" });
        } else {
            fs.readFile('./node-red/flows/psflow.json', 'utf8', function (err, data) {
                if (err) throw err;
                else {
                    var flows = JSON.parse(data);
                    var finalData = flows.filter(function (temp) {
                        if (temp.z != docs.flowId && temp.id != docs.flowId) { return temp }
                    });
                    var json = JSON.stringify(finalData);
                    fs.writeFile('./node-red/flows/psflow.json', json, function (err) {
                        if (err) throw err;
                    })
                }
            });
            return;
        }
    })
}
/**
 * Find one record by id
 */
exports.findOnedataconnection = function (req, res) {
    res.send(req.dataConns);
}

//**********************************************************/
//***************Raw Files APIs***********************/

/**
 * Middleware for finding raw files by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dataByRawId = function (req, res, next, id) {
    Rawfiles.findById(id).exec(function (err, fileData) {
        if (err) {
            logger.error("Error while finding files" + 'error: ' + err, { Date: date });
            return next(err);
        } else if (!fileData) {
            logger.error("No file with that identifier has been found" + ' error: ' + err, { Date: date });
            return res.status(404).send({ message: "No file with that identifier has been found" });
        }
        req.fileData = fileData;
        next();
    })
};

//Function to Insert Raw Files
exports.insertRawFiles = function (req, res) {
    logger.info('Creating Rwa Files');
    var data = req.body;
    data.createdBy = req.user_id;
    var rawfiles = new Rawfiles(data);
    rawfiles.save(function (err, doc) {
        if (err) {
            logger.error('Unable to save Raw Files' + 'error: ' + err, { Date: date });
            res.status(400).send({ statusText: 'Unable to save Raw Files' });
        }
        else {
            logger.info('Raw Files created' + doc, { Date: date });
            res.send(doc);
        }
    });
}


//Function to List Raw Files
exports.rawFilesList = function (req, res) {
    queryObj = { projectId: req.project._id, isDeleted: false };
    var obj = {};
    //res.send(req.ConnectionData)
    Rawfiles.find(queryObj, function (err, docs) {
        if (err) {
            logger.error('Could not fetch raw files details' + 'error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not fetch Raw Files details!', err: err });
        }
        logger.info('Rawfiles founded' + 'projectId' + req.project._id, { Date: date });
        res.send(docs);
    })
}

//Function to delete Raw Files
module.exports.deleteRawFile = function (req, res) {
    var fileToDelete = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.fileData.filename });
    Rawfiles.deleteOne({ _id: req.fileData._id })
        .then(function () {
            fs.unlink(path.resolve(fileToDelete), function () {
                logger.info('Files deleted successfully' + 'filesId: ' + req.fileData._id, { Date: date });
                res.send({ message: 'File deleted successfully!' })
            });
        }, function (err) {
            logger.error('Could not delete file' + 'error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not delete file!.' });
        })
}

module.exports.deleteAllRawfiles = function (req, res) {
    var data = req.body.data;
    for (var i = 0; i < data.length; i++) {
        var fileToDelete = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.body.projectId, fileName: data[i].name });
        Rawfiles.deleteOne({ _id: data[i]._id }).then(function () {
            fs.unlink(path.resolve(fileToDelete), function () {
                logger.info('Raw File deleted successfully' + 'projectId: ' + req.body.projectId, { Date: date });
            });
        }, function (err) {
            logger.error('Could not delete raw file!' + 'projectId: ' + req.query.projectId, { Date: date })
            res.status(400).send({ message: 'Could not delete raw file!.' });
        })
    }
    res.send({ message: 'Raw file deleted successfully!' })
}
//function to preview the rawfiles
module.exports.getPreviewDataRawFiles = function (req, res) {
    var isDataTypeRequired = req.query.isDataTypeRequired ? req.query.isDataTypeRequired : false;
    var data = {
        filePath: uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.fileData.filename }),
        fileExtension: path.extname(req.fileData.filename),
        fileEncoding: req.fileData.fileEncoding,
        numRows: req.query.numRows || 5
    }

    var options = {
        uri: ps_core_server_url + '/api/data/get_preview',
        method: 'POST',
        json: data
    };
    request(options, function (error, response, body) {
        if (response.statusCode != 200) {
            logger.error('Could not build preview of rawfiles' + 'projectId: ' + req.project._id, { Date: date })
            res.status(400).json(response.body)
        } else {
            logger.info('Preview of raw file generated' + 'projectId: ' + req.project._id, { Date: date })
            res.json(response.body)
        }
    });
}

//function to execure the dataflow
module.exports.executeFlow = function (req, res) {
    var project = {};
    Dataconnection.findById(req.query.dataConnId, function (err, docs) {
        if (err) {
            logger.error('Could not find connection details' + 'error: ' + err, { Date: date });
            res.status(400).send({ message: 'Could not find connection details!', err: err });
        }
        if (docs.dataflowId) {
            UddFlow.find(docs.dataflowId, function (err, flow) {
                if (err) {
                    logger.error('Could not fetch flow details' + 'error: ' + err, { Date: date });
                    return res.status(400).send({ message: 'Could not fetch flow details!', err: err });
                }
                project.projectId = req.project._id.toString();
                project.createdBy = req.user._id.toString();
                project.uniqueFlowId = flow[0]._id.toString();
                project.flowId = flow[0].flowId;
                project.lastFetch = docs.lastFetch;
                project.dataConnId = req.query.dataConnId;
                project.dataGroupId = docs.dataGroupId.toString();
                var name = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id });
                project.basedir = name.replace('undefined', '');
                project.filename = req.query.filepath;
                project.filepath = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: req.query.filepath });
                uddFlowExecuter(project);
            });
        }
        logger.info('Execution Started' + 'dataconnectionId: ' + req.query.dataConnId, { Date: date });
        res.send({ message: 'Execution Started!' })
    })
}

/**
 * Executes the flow by triggering the API from project server controller
 * @param {*} flowParams 
 */
function uddFlowExecuter(flowParams) {
    uddParams = {};
    uddParams.projectId = flowParams.projectId,
        uddParams.uniqueFlowId = flowParams.uniqueFlowId;
    uddParams.createdBy = flowParams.createdBy;
    uddParams.flowId = flowParams.flowId;
    uddParams.projectId = flowParams.projectId;
    uddParams.dataGroupId = flowParams.dataGroupId;
    uddParams.dataConnId = flowParams.dataConnId;
    uddParams.lastFetch = flowParams.lastFetch;
    uddParams.filename = flowParams.filename;
    uddParams.basedir = flowParams.basedir;
    uddParams.filepath = flowParams.filepath;
    projectController.executeFlow(uddParams);
}

exports.downloadFile = function (req, res) {
    var log = {
        projectId: req.project._id,
        //userId: req.predictionResult.createdBy,
        level: "info",
        message: "Downloading file"
    };
    auditLogger.logit(log);

    var Fname = req.params.fileName

    var file = uploadUtil.costructAbsPath({ baseDir: config.projectDir, projectId: req.project._id, fileName: Fname });
    res.download(file);
};

module.exports.getSubscriptionDetails = async (req, res, next) => {
    try {
        if (!['null', 'undefined', null, undefined].includes(req?.user?.subscription)) {
            const docs = await Subscription.findOne({
                _id: req.user.subscription,
                createdBy: req.user?.roles?.includes('s_developer') ? req.user.createdBy : req.user._id,
            });
            if (docs) {
                req.subscription = docs;
                next();
            } else {
                req.subscription = null;
                next();
            }
        } else {
            req.subscription = null;
            next();
        }
    } catch (err) {
        logger.error('Error while finding subscription - ' + 'error: ' + err, { Date: date });
        next(err);
    }
}