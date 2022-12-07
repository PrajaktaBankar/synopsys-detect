var path = require('path'),
  logger = require(path.resolve('./logger')),
  multer = require('multer');
var osChecker = require('../general/oschecker.utils.server');
const csv = require('csv-parser');
const fs = require('fs');
const basicSubscription = require('../../config/env/plans/basic-subscription');
const proSubscription = require('../../config/env/plans/pro-subscription');
const config = require('../../config/config');

var destination = './projects/';
if (osChecker.checkOs() == 'windows') {
  destination = '.\\projects\\';
} else {
  destination = './projects/';
}
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let modelDest;
    if (req.projectId) {
      var dest = destination + req.projectId;
      callback(null, path.resolve(dest));
    } else {
      switch (req.uploadType) {
        case 'model':
          if (osChecker.checkOs() == 'windows') {
            modelDest = '.\\textanalysis\\models\\';
          } else {
            modelDest = './textanalysis/models/';
          }
          break;
        case 'template':
          if (osChecker.checkOs() == 'windows') {
            modelDest = '.\\sampleprojects\\';
          } else {
            modelDest = './sampleprojects/';
          }
          break;
      }
      callback(null, path.resolve(modelDest));
    }
  },
  filename: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    callback(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
  },
});
module.exports.upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    var excludes = [
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
      return callback({ message: 'Uploaded file format is not supported or incorrect extension.' });
    }
    callback(null, true);
  },
}).single('file');

//Construct and return absolute path
module.exports.costructAbsPath = function (params) {
  if (osChecker.checkOs() == 'windows') {
    return path.resolve(params.baseDir + '\\' + params.projectId + '\\' + params.fileName);
  } else {
    return path.resolve(params.baseDir + '/' + params.projectId + '/' + params.fileName);
  }
};

//validation for the pslite file upload in all places i.e data page and quick prediction page
module.exports.validationForPsLite = function (req) {
  return new Promise(function (resolve, reject) {
    if (req.query.isReqFromPsLite && req.query.isReqFromPsLite === 'true') {
      let fileContent = [];
      let headerList = [];
      let pathOfUploadedFile = null;
      let noOfColsAllowed = 0;
      let noOfRowsAllowed = 0;
      const userPlanType =
        !req?.subscription?.planType && req?.subscription?.isFreeTrial
          ? 'pro'
          : req?.subscription?.planType;
      // console.log('this is the req ============================: ', userPlanType);
      // checking the rzpPlanId in psconfig file and setting up the plan type for given user. pro - plan_HqCmZBygcwQ0aF, basic - plan_HqCku7GYa35dul
      if (userPlanType === 'pro') {
        noOfColsAllowed = proSubscription.data.fileUpload.limits.noOfColsPermitForPro;
        noOfRowsAllowed = proSubscription.data.fileUpload.limits.noOfRowsPermitForPro;
      } else if (userPlanType === 'basic') {
        noOfColsAllowed = basicSubscription.data.fileUpload.limits.noOfColsPermitForBasic;
        noOfRowsAllowed = basicSubscription.data.fileUpload.limits.noOfRowsPermitForBasic;
      }
      if (req.query.type === 'prediction') {
        let dest = destination + req.project._id;
        pathOfUploadedFile = path.join(path.resolve(dest), req.file.filename);
      } else {
        pathOfUploadedFile = path.join(req.file.destination, req.file.filename);
      }
      fs.createReadStream(pathOfUploadedFile)
        .pipe(csv())
        .on('data', function (row) {
          for (let col in row) {
            if (fileContent[col] === undefined) {
              fileContent[col] = '';
            }
            fileContent[col] += row[col] + ',';
          }
        })
        .on('end', function () {
          for (let col in fileContent) {
            fileContent[col] = fileContent[col].split(',').filter((data) => data.length > 0);
            headerList.push(col);
          }
          let noOfRows = fileContent[headerList[0]].length;
          let noOfCols = headerList.length;
          // (noOfCols === 0 || noOfRows === 0) && reject({rowsAllowed: noOfRowsAllowed, colsAllowed: noOfColsAllowed})
          if (noOfRows <= noOfRowsAllowed && noOfCols <= noOfColsAllowed) {
            resolve('valid');
          } else {
            fs.unlink(pathOfUploadedFile, (err) =>
              err && err.code != 'ENOENT'
                ? console.log('error in deleting the file.')
                : console.log('deleted file successfully', noOfRows, noOfCols)
            );
            reject({ rowsAllowed: noOfRowsAllowed, colsAllowed: noOfColsAllowed });
          }
        });
    } else {
      // console.log('this is else not from pslite and saas********************');
      resolve('notFromPsLite');
    }
  });
};
