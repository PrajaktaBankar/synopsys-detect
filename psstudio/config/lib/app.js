'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./seed'),
  path = require('path'),
  coreSystemUtil = require('../../utils/system/core.system.utils');
var logger = require('./logger');
var lic = require('../../licenseApp/utils/core.license.util.js');
var fs = require('fs');
var crypter = require('../../utils/crypt/crypter');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);
    // logic to find the schedulers and create or delete the jobs based on license expiry.
    var schedulerUtil = require('../../utils/system/scheduler.system.utils');
    var schedulerController = require('../../modules/settings/server/controllers/scheduler.server.controller');
    lic.isValid(function (valid) {
      if(!valid) {
        console.log('license not valid, scheduler job will not be created.');
      } else {
        // console.log('this is lic appjs check : ', fs.existsSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json')));
        if(fs.existsSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'))){
          let Readdata = fs.readFileSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'));
          var activateConfig = crypter.decryptObject(Readdata.toString());
          activateConfig.stopScheduler = false;
          var encryptedJson = crypter.encryptObject(activateConfig);
          fs.writeFileSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'), JSON.stringify(encryptedJson));
          // console.log('this is already exist activate-data-json file : ', fs.existsSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json')));
        }
        schedulerController.findAllSchedulers().then(
          function (docs) {
            docs.forEach(function (data) {
              console.log('scheduler jobs are getting created');
              var jobData = {
                jobId: data._id,
                scheduleStartTime: data.scheduleStartTime,
                rule: data.rule,
              };
              schedulerUtil.createJob(jobData, function (err, resp) {
                if (err) {
                  logger.error('Could not create JOB for Schedule ID:' + data._id);
                } else {
                  lic.isValid(function (valid) {
                    if (!valid) {
                      if(fs.existsSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'))){
                        let Readdata = fs.readFileSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'));
                        var activateConfig = crypter.decryptObject(Readdata.toString());
                        activateConfig.stopScheduler = true;
                        var encryptedJson = crypter.encryptObject(activateConfig);
                        fs.writeFileSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'), JSON.stringify(encryptedJson));
                      }
                      schedulerUtil.schedule.gracefulShutdown().then(() => {
                        console.log('schedulers stopped!');
                        schedulerUtil.shutDownGracefully();
                      }).catch( (e)=> console.log('this is err : ',e));
                    }
                  });
                }
              });
            });
          },
          function (err) {
            console.log(err);
          }
        );
      }
    });
    var uploadProjectPath = path.resolve(config.projectDir + config.projectUploadDir);
    if (!fs.existsSync(uploadProjectPath)) {
      fs.mkdirSync(uploadProjectPath);
    }
    var extractProjectFolderPath = path.resolve(config.projectDir + config.projectExtractionDir);
    if (!fs.existsSync(extractProjectFolderPath)) {
      fs.mkdirSync(extractProjectFolderPath);
    }
    // Setup the DB
    require('../../utils/system/setup-db.system.utils');
  });
  coreSystemUtil.setDailyCrons();
  coreSystemUtil.getCPULoad();
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {
    // Start the app by listening on <port>
    app.listen(config.port, function () {
      // Logging initialization
      console.log('\n-------------------------------------------------------\n');
      console.log(chalk.green(config.app.title));
      console.log('\n');
      console.log(chalk.green('Environment:\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Port:\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t' + config.db.uri));
      if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.green('HTTPs:\t\t\t\ton'));
      }
      console.log(chalk.green('App version:\t\t' + config.meanjs.version));
      console.log(chalk.green('App type:\t\t' + config.app.type));
      console.log(chalk.green('Use captcha:\t\t' + config.app.useCaptcha));
      // if (config.meanjs['meanjs-version'])
      //   console.log(chalk.green('MEAN.JS version:\t\t' + config.meanjs['meanjs-version']));
      console.log('\n-------------------------------------------------------\n');

      if (callback) callback(app, db, config);
    });
  });
};
