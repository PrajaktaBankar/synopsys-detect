/**
 * Created by dushyant on 15/7/16.
 */
// 'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  logger = require(path.resolve('./logger')),
  socket = require('../socket/core.socket.utils'),
  os = require('os'),
  _ = require('lodash');
// var User = mongoose.model('User');
var User = require('../../modules/users/server/models/user.server.model').user;
var Subscription =
  require('../../modules/subscription/server/models/subscription.server.model').subscription;
var request = require('request');
var CronJob = require('cron').CronJob;
var lic = require('../../licenseApp/utils/core.license.util.js');
var crypter = require('../../utils/crypt/crypter');
var Subscription = mongoose.model('subscription');
const config = require('../../config/config');
var pscoreHost = require('../../config/env/pscore.config');
var ps_core_server_url =
  pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;

var commands = {
  restartService: 'systemctl restart psstudio',
};

var exec = require('child_process').exec;
exports.setDailyCrons = setDailyCrons;

exports.restartService = restartService;
exports.getCPULoad = getCPULoad;
exports.deleteFiles = deleteFiles;
/**
 * Function to delete the files
 */
function deleteFiles(files, callback) {
  var i = files.length;
  files.forEach(function (filepath) {
    fs.unlink(filepath, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}
/**
 * Starts Daily cron service
 */
function setDailyCrons() {
  // Set 24 hourly cron job
  // Set 24 hourly cron job
  // var cronJob = require('cron').CronJob;
  // new cronJob("0 0 0 * * *", function () {
  //     setPurgeCrons();
  // }, null, true);
  //Cron job for every 12 hour
  //--- 0 */12 * * *
  var job1 = new CronJob('1 */12 * * *', function () {
    //check license status
    checkLicenseStatus();
  });
  // Cron job for every day at midnight 12am
  var job2 = new CronJob('10 0 * * *', async function () {
    await checkPlanExpiry();
  });
  config.appType === 'saas' ? job2.start() : job1.start();
}

// Check if the users plans or free trail have expired
async function checkPlanExpiry() {
  try {
    let users = [];
    let alreadyExpired = [];
    let expiringToday = [];
    let willBeExpiring = [];
    users = await User.find({}).populate('subscription');
    if (users.length) {
      users.forEach((item) => {
        if (item.subscription) {
          if (new Date(item.subscription.planEnd) < new Date() && item.subscription.status === 'active') {
            alreadyExpired.push(item.subscription._id);
          } else if (new Date(item.subscription.planEnd).getDate() === new Date().getDate()) {
            expiringToday.push(item.subscription._id);
          } else if (new Date(item.subscription.planEnd) > new Date()) {
            willBeExpiring.push(item.subscription._id);
          }
        }
      });
      doBulkUpdate(alreadyExpired);
    }
  } catch (err) {
    logger.error('CRON - users error -' + err);
  }
}

/**
 * Performs the bulk update on subscription collection
 * @param {*} params
 */
function doBulkUpdate(idsArray) {
  try {
    idsArray.forEach(async (item) => {
      const docs = await Subscription.findOneAndUpdate(
        { _id: item, status: 'active' },
        { status: 'inactive', isFreeTrial: false, updatedAt: Date.now() },
        { new: true }
      );
    });
    logger.info('CRON - subscription bulk update done');
  } catch (e) {
    logger.error('CRON - could not perform bulk update -' + e);
  }
}

// checkLicenseStatus();
function checkLicenseStatus(callback) {
  lic.licenseDetails(function (err, licData) {
    if (err) {
      lic.isValid(function (valid) {
        if (!valid) {
          logger.error('License is not valid');
          // Restart service or reboot machine
          restartService();
        }
      });
    } else {
      validate(licData, function (data) {
        logger.log(data);
        if (data) {
          lic.isValid(function (valid) {
            if (!valid) {
              logger.error('License is not valid');
              // Restart service or reboot machine
              restartService();
            }
          });
        }
      });
    }
  });
}
function validate(licData, callback) {
  var encryptedJson = crypter.encryptObject(licData);
  var options = {
    method: 'POST',
    body: { details: encryptedJson }, // Javascript object
    json: true, // Use,If you are sending JSON data
    url: 'http://license.winjit.com/api/license/check',
  };
  request(options, function (err, response) {
    var license = null;
    if (err) {
      logger.error('Error getting license info from remote server.');
      callback({ status: 'no_remote_server' });
    } else {
      if (response['body']['status'] == 'no_change') {
        logger.info('All good with license');
        callback({ status: 'No change in license data' });
      } else {
        var integrity = false;
        var decJson = crypter.decryptObject(response.body.response);
        license = decJson;
        if (!license) {
          callback({ status: 'Remote server throwed an error.' });
        } else {
          integrity = lic.checkIntegrity(license);
          if (integrity)
            lic.saveLicense(license, function (err, success) {
              if (!err) restartService();
              callback({ status: 'License updated' });
            });
          else callback({ status: 'New license integrity chekc failed' });
        }
      }
    }
  });
}
function restartService() {
  logger.warn('Restarting service');
  lic.isValid(function (valid) {
    if (!valid) {
      logger.error('License is not valid');
      // call to pscore shutdown api
      var options = {
        uri: ps_core_server_url + '/api/shutdown',
        method: 'GET'
      };
      request(options, function (error, response, body) {
        if (response.statusCode != 200) {
          logger.error('Error in shutting down Pscore');
          // response.status(400).send(response.body)
        } else {
          logger.info('Pscore shutdown successfully');
          // response.send({ message: 'Started pulling data.' })
        }
      });
    }
  });
  // Set timeout for restart after 10s
  setTimeout(function () {
    exec(commands.restartService, function (err) {
      if (err) {
        logger.error('Could not restart service.', { error: err });
        restartServer();
      }
    });
  }, 100);
}
//Function to restart the application without systemd service
function restartServer() {
  process.on('exit', function () {
    require('child_process').spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit',
    });
  });
  process.exit();
}
function getCPULoad() {
  var old = _.map(os.cpus(), function (cpu) {
    return cpu.times;
  });
  var interval = 5;
  setInterval(function () {
    var result = [];
    var current = _.map(os.cpus(), function (cpu) {
      return cpu.times;
    });

    _.each(current, function (item, cpuKey) {
      result[cpuKey] = {};
      var totalTick = 0;
      var totalTickOldValue = 0;

      var oldVal = old[cpuKey];
      _.each(_.keys(item), function (timeKey) {
        totalTick += item[timeKey];
        totalTickOldValue += oldVal[timeKey];
      });
      var avgTotalTick = totalTick / _.keys(item).length;
      var avgTotalTickOldValue = totalTickOldValue / _.keys(oldVal).length;
      var currentIdleValue = item.idle / _.keys(item).length;
      var oldIdleValue = oldVal.idle / _.keys(oldVal).length;

      var idleDifference = currentIdleValue - oldIdleValue;
      var totalDifference = avgTotalTick - avgTotalTickOldValue;

      var cpuLoadInPercentage = 100 - ~~((100 * idleDifference) / totalDifference);
      result[cpuKey]['CPU'] = cpuLoadInPercentage.toFixed(0);
    });
    socket.broadcast('cpuLoad', result);
    old = current;
  }, interval * 1000);
}
