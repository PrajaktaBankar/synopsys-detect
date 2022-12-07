const mongoose = require('mongoose');
const Template = mongoose.model('template');
const User = mongoose.model('User');
const uploadUtil = require('../../../../utils/general/uploader.utils.server');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const dateInst = Date(Date.now());
const date = dateInst.toString();
const osChecker = require('../../../../utils/general/oschecker.utils.server');
var Unzipper = require('decompress-zip');
let fileUploadDest;
if (osChecker.checkOs() === 'windows') {
  fileUploadDest = '.\\sampleprojects\\';
} else {
  fileUploadDest = './sampleprojects/';
}

/**
 * Uploads the file with original name to destination folder
 */
const fileStorage = multer.diskStorage({
  destination: fileUploadDest,
  filename: (req, file, cb) => {
    // If destination dir is not found, then create the new one
    if (!fs.existsSync(fileUploadDest)) {
      fs.mkdirSync(fileUploadDest, { recursive: true });
    }
    cb(null, file.originalname);
  },
});

/**
 * Generates a new ticket
 * @param {*} req
 * @param {*} res
 */
exports.createTemplate = async (req, res) => {
  try {
    await checkCorruptFile(req, res);
    const data = JSON.parse(req.body.data);
    const template = new Template(data);
    const docs = await template.save();
    if (docs) {
      res.send({ code: 200, message: '', data: docs });
    } else {
      logger.error('Unable to save in DB', { error: err, Date: date });
      res.send({ code: 400, message: 'Cannot create template', data: docs });
    }
  } catch (err) {
    logger.error('Unable to create template', { error: err, Date: date });
    res.status(400).send({ error: err || 'Unable to create template', data: null });
  }
};

// function to check if the zip file is corrupted or not.
function checkCorruptFile(req, res) {
  return new Promise(function (resolve, reject) {
    fileUpload(req, res, function (err) {
      if (err) {
        reject({ message: 'Uploaded file format is not supported!' });
      }
      var extractionPath = null;
      if (osChecker.checkOs() == 'windows') {
        req.destination = config.projectUploadDir + '\\' + req.user._id;
        extractionPath =
          config.projectDir + '\\' + config.projectExtractionDir + '\\' + req.user._id;
      } else {
        req.destination = config.projectUploadDir + '/' + req.user._id;
        extractionPath = config.projectDir + '/' + config.projectExtractionDir + '/' + req.user._id;
      }
      req.file = {
        destination: './sampleprojects',
        filename: req.file.filename,
      };
      var filepath = path.join(req.file.destination, req.file.filename);
      var unzipper = new Unzipper(filepath);
      unzipper.on('error', function (err) {
        //Remove the zip file
        var zipfileToBeDeleted = path.join(req.file.destination, req.file.filename);
        // check if upload type is import project call delete function.
        deleteFile(zipfileToBeDeleted);
        reject({ message: 'Project template zip is corrupted!' });
      });
      //Once extraction is completed it will emit this event
      unzipper.on('extract', function (result) {
        deleteFile(extractionPath);
        resolve({ message: 'Project template uploaded successfully!' });
      });
      unzipper.extract({ path: extractionPath });
    });
  });
}

/**
 * Fetches all the tickets
 * @param {*} req
 * @param {*} res
 */
exports.getAllTemplates = async (req, res) => {
  try {
    const docs = await Template.find({});
    docs
      ? res.send({ code: 200, message: '', data: docs })
      : res.send({ code: 400, message: 'No tickets found.', data: docs });
  } catch (err) {
    logger.error('Could not find templates', { error: err, Date: date });
    res.status(500).send({ message: err || 'Could not find templates' });
  }
};

/**
 * Updates the template
 * @param {*} req
 * @param {*} res
 */
exports.updateTemplate = async (req, res) => {
  try {
    const body = req.body;
    const templateData = req.template;
    if (templateData) {
      const docs = await Template.findByIdAndUpdate(
        { _id: templateData._id },
        {
          ...body,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      if (docs) {
        logger.info('Template updated', { Date: date });
        res.send({ code: 200, message: '', data: docs });
      } else {
        res.send({ code: 400, message: 'Cannot update the template', data: docs });
      }
    } else {
      logger.error('Template not found', { error: err, Date: date });
      res.status(500).send({ message: 'Template not found' });
    }
  } catch (err) {
    logger.error('Could not update the template', { error: err, Date: date });
    res.status(500).send({ message: err || 'Could not update the template' });
  }
};

/**
 * Deletes the template from DB
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const templateData = req.template;
    if (templateData) {
      const docs = await Template.findOneAndDelete({
        _id: templateData._id,
        createdBy: templateData.createdBy,
      });
      const filepath = `${fileUploadDest}${templateData.file}`;
      // Deletes the zip file from folder
      fs.unlink(path.resolve(filepath), (err) => {
        if (err && err.code === 'ENOENT') {
          // file doens't exist
          logger.info("File doesn't exist, won't remove it.", { Date: date });
        } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          logger.error('Error occurred while trying to remove file', { Date: date });
        } else {
          logger.info('File removed', { Date: date });
        }
      });
      docs
        ? res.send({ code: 200, message: '', data: docs })
        : res.send({ code: 400, message: 'Cannot delete the template', data: docs });
    } else {
      logger.error('Template not found', { error: err, Date: date });
      res.status(500).send({ message: 'Template not found' });
    }
  } catch (err) {
    logger.error('Error while deleting template', { error: err, Date: date });
    res.status(500).send({ message: 'Could not delete the template' });
  }
};

/**
 * Middleware for validating the user and fetching template data by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.templateById = async (req, res, next) => {
  try {
    const docs = await Template.findOne({
      _id: req.params.templateId,
      createdBy: req.user._id,
    });
    if (docs) {
      req.template = docs;
      next();
    } else {
      req.template = null;
      next();
    }
  } catch (err) {
    logger.error('Error while finding templates', { error: err, Date: date });
    next(err);
  }
};

/**
 * Filters the file and uploads it to the dest folder
 */
var fileUpload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const excludes = [
      '.csv',
      '.zip',
      '.xlsx',
      '.xls',
      '.pkl',
      '.pk',
      '.pl',
      '.pickle',
      '.json',
      '.html',
      '.whl',
      '.pdf',
    ];
    if (!_.includes(excludes, ext)) {
      return cb(new Error('Uploaded file format is not supported or incorrect extension.'));
    }
    cb(undefined, true);
  },
}).single('file');

/**
 * Function to delete an old uploaded file.
 * @param req
 * @param res
 * @param next
 */
function deleteFile(fileToBeDeleted) {
  if (fileToBeDeleted) {
    fs.unlink(fileToBeDeleted, function (err) {
      if (err && err.code == 'ENOENT') {
        // file doens't exist
        logger.info("File doesn't exist, won't remove it.", { Date: date });
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        logger.error('Error occurred while trying to remove file', { Date: date });
      } else {
        logger.info('File removed', { Date: date });
      }
    });
  }
}

/**
 * Create default projects during the predictsense setup.
 */
exports.createDefaultProjects = async () => {
  try {
    let data;
    const user = await User.findOne({ roles: ['super_admin'], email: `${process.env.MAILER_EMAIL_ID}` });
    if (!user) {
      return 'Projects: No sudo user found with super_admin role';
    }
    const count = await Template.find().countDocuments();
    if (count === 0) {
      // Then save the template projects
      await Template.insertMany([
        {
          name: 'Diabetes',
          domain: 'health_care',
          description:
            "In this project, we're trying to predict the outcome of diabetes with respect to few parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: '6259128464a5fc00183090dd.zip',
          createdBy: user._id,
        },
        {
          name: 'Right Amount to Ask',
          domain: 'banking',
          description:
            "In this project, we're trying to predict the right amount to ask with respect to few loan parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: '625914a664a5fc001830911b.zip',
          createdBy: user._id,
        },
        {
          name: 'Right Time to Call',
          domain: 'banking',
          description:
            "In this project, we're trying to predict the right time to call with respect to few parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: '6259199d64a5fc00183091a8.zip',
          createdBy: user._id,
        },
        {
          name: 'Mall Customers segmentation',
          domain: 'other',
          description:
            "In this project, we're trying to cluster Mall customers sharing similar characteristics with known parameters. The clusters can further be analyzed to understand them better and assign a descriptive label that summarizes the property of the clusters.",
          file: '6258fa6a03e6935913f5a994.zip',
          createdBy: user._id,
        },
        {
          name: 'Species classification',
          domain: 'agriculture',
          description:
            "In this project, we're trying to predict the species of the IRIS flower with respect to the known flower parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: '625930cc64a5fc0018309217.zip',
          createdBy: user._id,
        },
        {
          name: 'Exam score',
          domain: 'other',
          description:
            "In this project, we're trying to predict the overall university GPA with respect to the known parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: '6259354a64a5fc0018309245.zip',
          createdBy: user._id,
        },
        {
          name: 'Stock Price',
          domain: 'banking',
          description:
            "In this project, we're trying to forecast the stock price high using past time-series data and with respect to known parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: 'StockPrice.zip',
          createdBy: user._id,
        },
        {
          name: 'Insurance Claim',
          domain: 'insurance',
          description:
            "In this project, we're trying to predict if insurance has been claimed with respect to various known parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: '625937ec64a5fc00183092a2.zip',
          createdBy: user._id,
        },
        {
          name: 'Car Segmentation',
          domain: 'manufacturing',
          description:
            "In this project, we're trying to cluster car models sharing similar characteristics with known parameters. The clusters can further be analyzed to understand them better and assign a descriptive label that summarizes the property of the clusters.",
          file: '625d48c8b7cee0af8c3ee4d5.zip',
          createdBy: user._id,
        },
        {
          name: 'Weather prediction',
          domain: 'other',
          description:
            "In this project, we're trying to forecast the humidity using past time-series weather data and with respect to known parameters. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: 'Weather prediction.zip',
          createdBy: user._id,
        },
        {
          name: 'Construction Cost Prediction',
          domain: 'other',
          description:
            'In this project, we are predicting the construction cost. For prediction, we are using physical data and Economic variables. In cost prediction algorithm, people are using only physical variables but construction cost also depends on economic variables these factors we are considering in this model to get a better prediction.',
          file: '625cebc1c73e7b0023477ac3.zip',
          createdBy: user._id,
        },
        {
          name: 'Credit card customer segmentation',
          domain: 'banking',
          description:
            "In this project, we're trying to cluster credit card customers sharing similar characteristics with known parameters. The clusters can further be analyzed to understand them better and assign a descriptive label that summarizes the property of the clusters.",
          file: 'credit_card_customer_segmentation.zip',
          createdBy: user._id,
        },
        {
          name: 'Meal delivery demand forecasting',
          domain: 'other',
          description:
            "In this project, we're trying to forecast the number of orders using Multiple Timeseries data of a meal delivery company. This will help the client to plan the stock of raw materials for all centers accordingly. The performance can be improved by tweaking the hyper parameters and other training configurations.",
          file: 'Meal delivery demand forecasting.zip',
          createdBy: user._id,
        },
      ])
        .then((doc) => {
          doc ? (data = 'Projects created') : (data = 'Projects not created');
        })
        .catch((e) => (data = `Projects creation failed - Error: ${e.message}`));
    } else {
      data = 'Default projects present';
    }
    return data;
  } catch (error) {
    // logger.error('Default projects creation failed', { error: error.message, Date: date });
    return `Projects creation failed - Error: ${error.message}`;
  }
};
