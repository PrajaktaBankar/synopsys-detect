const mongoose = require('mongoose');
const Dataset = mongoose.model('dataset');
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
  fileUploadDest = '.\\sampledatasets\\';
} else {
  fileUploadDest = './sampledatasets/';
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
exports.createdataset = async (req, res) => {
  try {
    await checkCorruptFile(req, res);
    const data = JSON.parse(req.body.data);
    const dataset = new Dataset(data);
    const docs = await dataset.save();
    if (docs) {
      res.send({ code: 200, message: '', data: docs });
    } else {
      logger.error('Unable to save in DB', { error: err, Date: date });
      res.send({ code: 400, message: 'Cannot create dataset', data: docs });
    }
  } catch (err) {
    logger.error('Unable to create dataset', { error: err, Date: date });
    res.status(400).send({ error: err || 'Unable to create dataset', data: null });
  }
};

// function to check if the zip file is corrupted or not.
function checkCorruptFile(req, res) {
  return new Promise(function (resolve, reject) {
    fileUpload(req, res, function (err) {
      if (err) {
        reject({ message: 'Uploaded file format is not supported!' });
      }
      resolve({ message: 'Uploaded successfully!' });
    });
  });
}

/**
 * Fetches all the tickets
 * @param {*} req
 * @param {*} res
 */
exports.getAlldatasets = async (req, res) => {
  try {
    const docs = await Dataset.find({});
    docs
      ? res.send({ code: 200, message: '', data: docs })
      : res.send({ code: 400, message: 'No datasets found.', data: docs });
  } catch (err) {
    logger.error('Could not find datasets', { error: err, Date: date });
    res.status(500).send({ message: err || 'Could not find datasets' });
  }
};

/**
 * Updates the dataset
 * @param {*} req
 * @param {*} res
 */
exports.updatedataset = async (req, res) => {
  try {
    const body = req.body;
    const datasetData = req.dataset;
    if (datasetData) {
      const docs = await Dataset.findByIdAndUpdate(
        { _id: datasetData._id },
        {
          ...body,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      if (docs) {
        logger.info('dataset updated', { Date: date });
        res.send({ code: 200, message: '', data: docs });
      } else {
        res.send({ code: 400, message: 'Cannot update the dataset', data: docs });
      }
    } else {
      logger.error('dataset not found', { error: err, Date: date });
      res.status(500).send({ message: 'dataset not found' });
    }
  } catch (err) {
    logger.error('Could not update the dataset', { error: err, Date: date });
    res.status(500).send({ message: err || 'Could not update the dataset' });
  }
};

/**
 * Deletes the dataset from DB
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deletedataset = async (req, res) => {
  try {
    const datasetData = req.dataset;
    if (datasetData) {
      const docs = await Dataset.findOneAndDelete({
        _id: datasetData._id,
        createdBy: datasetData.createdBy,
      });
      const filepath = `${fileUploadDest}${datasetData.file}`;
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
        : res.send({ code: 400, message: 'Cannot delete the dataset', data: docs });
    } else {
      logger.error('dataset not found', { error: err, Date: date });
      res.status(500).send({ message: 'dataset not found' });
    }
  } catch (err) {
    logger.error('Error while deleting dataset', { error: err, Date: date });
    res.status(500).send({ message: 'Could not delete the dataset' });
  }
};

/**
 * Middleware for validating the user and fetching dataset data by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.datasetById = async (req, res, next) => {
  try {
    const docs = await Dataset.findOne({
      _id: req.params.datasetId,
      createdBy: req.user._id,
    });
    if (docs) {
      req.dataset = docs;
      next();
    } else {
      req.dataset = null;
      next();
    }
  } catch (err) {
    logger.error('Error while finding datasets', { error: err, Date: date });
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
      '.xlsx',
      '.xls',
      '.pkl',
      '.pk',
      '.pl',
      '.pickle',
      '.json',
      '.html',
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
 * Creates the default datasets during the predictsense setup.
 */
exports.createDefaultDatasets = async () => {
  try {
    let data;
    const user = await User.findOne({ roles: ['super_admin'], email: `${process.env.MAILER_EMAIL_ID}` });
    if (!user) {
      return 'Datasets: No sudo user found with super_admin role';
    }
    const count = await Dataset.find().countDocuments();
    if (count === 0) {
      // Then save the dataset projects
      await Dataset.insertMany([
        {
          name: 'Car dataset',
          domain: 'clustering',
          description:
            'This dataset describes various specifications and features of a Car. Some or all of these features can be used to segment the Cars into discrete clusters sharing similar properties.',
          file: 'Car_segmentation.csv',
          createdBy: user._id,
        },
        {
          name: 'Customer dataset',
          domain: 'clustering',
          description:
            'This dataset describes various features and behaviors of Mall customers. Some or all of these features can be used to segment the Customers into discrete clusters sharing similar properties.',
          file: 'Customer_segmentation.csv',
          createdBy: user._id,
        },
        {
          name: 'Diabetes dataset',
          domain: 'predictive_modeling',
          description:
            'This dataset contains features describing medical data of patients at a hospital. Some or all of these features can be used to classify whether or not the patient has Diabetes.',
          file: 'diabetes.csv',
          createdBy: user._id,
        },
        {
          name: 'Insurance dataset',
          domain: 'predictive_modeling',
          description:
            'This dataset describes various features of medical history and other attributes of an insurance policy holder. Some or all of these features can be used to classify whether or not insurance has been claimed by the policy holder.',
          file: 'insurance.csv',
          createdBy: user._id,
        },
        {
          name: 'Exams dataset',
          domain: 'predictive_modeling',
          description:
            'This dataset contains features describing various GPA and scores of Students in a university. Some or all of these features can be used to predict the overall university grade point average of the students.',
          file: 'Exams.csv',
          createdBy: user._id,
        },
        {
          name: 'IRIS dataset',
          domain: 'predictive_modeling',
          description:
            'This dataset describes various features of flowers of the IRIS genus. Some or all of these features can be used to predict the species of the IRIS flower.',
          file: 'IRIS.csv',
          createdBy: user._id,
        },
        {
          name: 'Stock price dataset',
          domain: 'timeseries',
          description:
            'This dataset contains time-series data describing various trading features of a particular stock. Some or all of these features can be used to forecast future values of a feature of the Stock.',
          file: 'stock_prices.csv',
          createdBy: user._id,
        },
        {
          name: 'Weather dataset',
          domain: 'timeseries',
          description:
            'This dataset contains time-series data describing various meteorological features of weather. Some or all of these features can be used to forecast future values of a particular weather feature.',
          file: 'Weather.csv',
          createdBy: user._id,
        },
        {
          name: 'Meal delivery demand forecasting',
          domain: 'timeseries',
          description:
            'This dataset contains Multiple time-series data describing various meal features of a particular demand (number of orders ). Some or all of these features can be used to forecast future values of a particular demand (number of orders)',
          file: 'Meal_delivery_company.csv',
          createdBy: user._id,
        },
        {
          name: 'Credit card customer data cluster',
          domain: 'clustering',
          description:
            'This dataset describes various features and behaviors of Credit card customers. Some or all of these features can be used to segment the Customers into discrete clusters sharing similar properties.',
          file: 'Credit card customer data.csv',
          createdBy: user._id,
        },
      ])
        .then((doc) => {
          doc ? (data = 'Datasets created') : (data = 'Datasets not created');
        })
        .catch((e) => (data = `Datasets creation failed - Error: ${e.message}`));
    } else {
      data = 'Default datasets present';
    }
    return data;
    // });
  } catch (error) {
    return `Datasets creation failed - Error: ${error.message}`;
  }
};
