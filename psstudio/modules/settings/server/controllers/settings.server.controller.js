const path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    Settings = mongoose.model('settings'),
    TaModel = mongoose.model('taModel');
const uploadUtil = require('../../../../utils/general/uploader.utils.server');
const request = require('request');
const rmdir = require('rimraf');
const archiver = require('archiver');
const Unzipper = require("decompress-zip");
const osChecker = require("../../../../utils/general/oschecker.utils.server");
//pscore host details
const pscoreHost = require("../../../../config/env/pscore.config");
var date = Date(Date.now());
date = date.toString();
//PSCORE HOST
var ta_ps_core_server_url = pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.taHost + pscoreHost.hostDetails.taPort;
let extractZipFileToDestination;
module.exports.list = function (req, res) {
    Settings.find().then(function (data) {
        res.send(data);
    }, function () {
        logger.error('error in retriving data from settings db', { Date: date });
        res.status(400).send({ message: 'Could not find any settings!' });
    });
};

//function to get tamodel list from the collection
module.exports.listTaModel = async (req, res) => {
    try {
        const taModelList = req.query.taskType ? await TaModel.find({ taskType: req.query.taskType }) : await TaModel.find();
        res.status(200).send(taModelList);
    } catch (error) {
        logger.error('Could not find taModel' + ' error: ' + error, { Date: date })
        return res.status(400).send({ message: 'Could not find taModel', err: error });
    }
}


module.exports.find = function (req, res, next) {
    var type = req.query.type;
    var query = { createdBy: req.user._id }

    Settings.find(query, function (err, settings) {
        if (err) {
            logger.error('Could not find any settings', { Date: date });
            return res.status(400).send({ message: 'Could not find any settings!' });
        }
        // res.send(settings);
        req.settings = settings;
        next();
    })
}


module.exports.create = function (req, res) {
    var data = req.body;
    data.createdBy = req.user._id;
    var settings = new Settings(data);
    settings.save(data, function (err, doc) {
        if (err) {
            logger.error('Could not save the settings', { Date: date });
            return res.status(400).send({ message: 'Could not save the settings' });
        }
        res.send(doc)
    })
}
//Function to delete a setting
module.exports.delete = function (req, res) {
    var hostId = req.settings._id;
    Settings.deleteOne({ _id: hostId }).then(function () {
        res.send({ message: 'Deleted the host successfully!' });
    }, function () {
        logger.error('Could not delete the host', { Date: date });
        res.status(400).send({ message: 'Could not delete the host!' });
    });
};

module.exports.updateSettings = function (req, res) {
    var settings = req.settings;
    settings = _.extend(req.settings, req.body);
    settings.save(function (err, setting) {
        if (err) {
            logger.error('Could not save the settings', { Date: date });
            return res.status(400).send({ meassage: 'Could not save the settings!' })
        }
        res.send(settings);

    })
}

/**
 * function to upload the model for doing analysis, only valid for super_admin and admin
 * @param {*} req 
 * @param {*} res 
 * values for url upload option is given through the body and for uploader option it is in query
 */
exports.uploadModelForAnalysis = (req, res) => {
    let dest = "./textanalysis/models/";
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    if (!req.body.uploadUrl && !req.body.modelName) {
        // Indication to upload file on required path, from multer
        req.uploadType = 'model';
        uploadUtil.upload(req, res, (err) => {
            if (err) {
                logger.error("Could not upload model file", { Date: date });
                res.status(400).send(err);
            }
            let modelZipFilePath = `./textanalysis/models/${req.file.filename}`;
            let taskType = req.query.taskType.split(',');
            extractZipFileToDestination(modelZipFilePath, req.file.filename, taskType).then((resText) => {
                if (resText.message === "Valid" || resText.message === "Model has been imported successfully.") {
                    //information related to tamodel which needs to be stored in taModel collection.
                    req.file.filename = req.file.filename.split('.');
                    req.file.originalname = req.file.originalname.split('.');
                    let modelInfo = {
                        modelName: req.file.filename[0],
                        frameWork: req.query.frameWork,
                        taskType: taskType || null,
                        createdBy: req.user._id,
                        oldModelFileName: req.file.originalname[0]
                    }
                    if (resText.nerLabels.length) {
                        modelInfo.nerLabels = resText.nerLabels;
                    }
                    makeEntryInTaModel(modelInfo).then(() =>
                        res.status(200).send({ message: 'Model uploaded successfully.' }),
                        (err) =>

                            res.status(400).send({ message: 'Unable to save model.' }));
                } else {
                    res.status(400).send(resText);
                }
            }, (err) => {
                res.status(400).send(err);
            });
        })
    } else {
        let ext = path.extname(req.body.uploadUrl);
        if (ext == ".zip") {
            let modelName = req.body.modelName + "-" + Date.now() + ext;
            let modelDest = null;
            // specifying path based on OS
            if (osChecker.checkOs() == "windows") {
                modelDest = `.\\textanalysis\\models\\${modelName}`;
            } else {
                modelDest = `./textanalysis/models/${modelName}`;
            }
            let modelFile = fs.createWriteStream(path.resolve(modelDest));
            request({
                uri: req.body.uploadUrl,
                gzip: true
            })
                .pipe(modelFile)
                .on('finish', () => {
                    let modelZipFilePath = null;
                    // specifying path based on OS
                    if (osChecker.checkOs() == "windows") {
                        modelZipFilePath = `.\\textanalysis\\models\\${modelName}`;
                    } else {
                        modelZipFilePath = `./textanalysis/models/${modelName}`;
                    }
                    extractZipFileToDestination(modelZipFilePath, modelName, req.body.taskType).then((resText) => {
                        if (resText.message === "Valid" || resText.message === "Model has been imported successfully.") {
                            //information related to tamodel which needs to be stored in taModel collection.
                            modelName = modelName.split('.');
                            let modelInfo = {
                                modelName: modelName[0],
                                frameWork: req.body.frameWork,
                                taskType: req.body.taskType || null,
                                createdBy: req.user._id
                            }
                            if (resText.nerLabels.length) {
                                modelInfo.nerLabels = resText.nerLabels;
                            }
                            makeEntryInTaModel(modelInfo).then(() => res.status(200).send({ message: 'Model uploaded successfully!' }),
                                (err) => res.status(400).send('Model not able to Save!'));
                        } else {
                            res.status(400).send(resText);
                        }
                    }, (err) => {
                        res.status(400).send(err);
                    });
                })
                .on('error', () => res.status(400).send({ message: 'Unable to download.' }));
        } else {
            res.status(400).send({ message: 'Only .zip file is supported.' });
        }
    }
}

//function to make entry in the tamodel collection
let makeEntryInTaModel = async (modelInfo) => {
    return await new Promise((resolve, reject) => {
        TaModel.create(modelInfo, async (err, docs) => {
            err ? reject({ message: 'Could not save TaModel!', err: err }) : resolve({ message: 'Model uploaded successfully!' });
        })
    })
}

module.exports.settingById = function (req, res, next, id) {
    Settings.findById(id, function (err, settings) {
        if (err) {
            return res.status(400).send({ message: 'Could not find any settings with that identifier!', err: err });
        }
        req.settings = settings;
        next();
    });
}

//function to unzip the models zip file and pass the modelpath to the python validation api 
extractZipFileToDestination = async (modelZipFilePath, modelName, taskType) => {
    return await new Promise((resolve, reject) => {
        let fileToSave = '', insideFolder = '';
        //file path of the file which need s to be extracted
        let unzipper = new Unzipper(modelZipFilePath);
        //if got an error while unzipping
        unzipper.on('error', err => {
            reject(err)
        });
        //Once extraction is completed it will emit this event
        unzipper.on("extract", async (result) => {
            try {
                //removing the zip file if it is there
                fs.unlink(path.resolve(modelZipFilePath), async (err) => (err && !err.code == "ENOENT") ? reject(err) : console.log('deleted zip file successfully'));
                //finding the name of the files and folder present inside the zip
                result.forEach(function (item) {
                    if (item.deflated) {
                        fileToSave = item.deflated;
                    } else if (item.folder) {
                        insideFolder = item.folder;
                    }
                });
                if (osChecker.checkOs() == "windows") {
                    let modelFolderName = insideFolder.split('\\');
                    let modelFileName = fileToSave.split('\\');
                    modelPath = path.resolve(`.\\textanalysis\\models\\${modelFolderName[0] || modelFileName[0]}`);
                } else {
                    let modelFolderName = insideFolder.split('/');
                    let modelFileName = fileToSave.split('/');
                    modelPath = path.resolve(`./textanalysis/models/${modelFolderName[0] || modelFileName[0]}`);
                }
                //File name after rename
                modelName = modelName.split('.');
                var pathToBeSaved = path.resolve(`./textanalysis/models/${modelName[0]}`);
                //Rename the extracted file
                fs.rename(modelPath, pathToBeSaved, async (err) => {
                    if (err) reject(err);
                    modelPath = pathToBeSaved;
                    //prepairing the data for the validation request
                    let data = {
                        modelPath: modelPath,
                        framework: "spacy",
                        taskType: taskType
                    }
                    //request to the validation api
                    let options = {
                        uri: ta_ps_core_server_url + '/api/v1/text_analysis/validate',
                        method: 'POST',
                        json: data
                    };
                    request(options, async (error, response, body) => {
                        if (error) {
                            reject(error);
                        } else {
                            if (!body.isValid) {
                                rmdir(modelPath, (err) => err ? reject(err) : resolve(body));
                            } else {
                                resolve(body);
                            }
                        }

                    });
                });
            } catch (error) {
                reject(error);
            }
        });
        if (osChecker.checkOs() == "windows") {
            unzipper.extract({ path: 'textanalysis\\models\\' });
        } else {
            unzipper.extract({ path: 'textanalysis/models/' });
        }
    });
}


/**
 * middleware to find the model by Id.
 * after finding the model it is set in the req as req.taModel.
 */
module.exports.modelById = async (req, res, next) => {
    try {
        const modelInfo = req.params.taModelId ? await TaModel.findById(req.params.taModelId) : await TaModel.findById(req.query.modelId);
        req.taModel = modelInfo;
        next();
    } catch (error) {
        logger.error('Could not find taModel with given id', { Date: date });
        return res.status(400).send({ message: 'Could not find taModel with given id', err: error });
    }
}

/**
 * function to delete the model from the db and system using the req.taModel value set by the middleware.
 */
module.exports.deleteTaModelById = async (req, res) => {
    let modelFilePath;
    try {
        if (osChecker.checkOs() == "windows") {
            modelFilePath = path.resolve(`.\\textanalysis\\models\\${req.taModel.modelName}`);
        } else {
            modelFilePath = path.resolve(`./textanalysis/models/${req.taModel.modelName}`);
        }
        rmdir(modelFilePath, async (err) => {
            if (err && !err.code == "ENOENT") {
                res.status(400).send(err);
            }
            await TaModel.remove(req.taModel);
            res.status(200).send({ message: 'Model Deleted successfully!' });
        });
    } catch (error) {
        logger.error('Could not delete model with given id', { Date: date });
        return res.status(400).send({ message: 'Could not delete model with given id', err: error });
    }
}

//function to prepare and download the zip file of the uploaded tamodel
module.exports.downloadTaModel = async (req, res) => {
    let zipOutDir;
    let directoryName = req.taModel.modelName;
    if (osChecker.checkOs() == "windows") {
        zipOutDir = '.\\textanalysis\\models\\' + directoryName + '.zip';
    } else {
        zipOutDir = './textanalysis/models/' + directoryName + '.zip';
    }
    let output = fs.createWriteStream(zipOutDir);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function () {
        let data = {
            downloadUrl: zipOutDir
        }
        return res.download(zipOutDir);
    });
    // This event is fired when the data source is drained no matter what was the data source.
    output.on('end', function () {
        console.log('On END called');
    });
    // good practice to catch this error explicitly
    archive.on('error', function (err) {
        logger.error('Error while archiving' + 'error:' + err, { Date: date });
        console.error("Error while archiving", { Date: date })
        res.status(400).send(err)
    });
    // append files from a sub-directory and naming it `static` within the archive
    if (osChecker.checkOs() == "windows") {
        archive.directory(path.resolve('.\\textanalysis\\models\\' + directoryName), directoryName);
    } else {
        archive.directory(path.resolve('./textanalysis/models/' + directoryName), directoryName);
    }
    archive.pipe(output);
    archive.finalize();
}