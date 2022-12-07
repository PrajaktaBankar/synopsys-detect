var schedule = require('node-schedule'),
  path = require('path'),
  mongoose = require('mongoose'),
  Scheduler = mongoose.model('Scheduler'),
  DataConnections = mongoose.model('Dataconnection'),
  UddFlow = mongoose.model('UddFlow'),
  ProjectConfig = mongoose.model('projectConfig'),
  logger = require(path.resolve('./logger'));
fs = require('fs');
ProjectController = require('../../modules/projects/server/controllers/projects.server.controller');
//PSCORE HOST
var pscoreHost = require('../../config/env/pscore.config');
var ps_core_server_url =
  pscoreHost.hostDetails.protocol + pscoreHost.hostDetails.host + pscoreHost.hostDetails.port;
var request = require('request');
var uploadUtil = require('../general/uploader.utils.server');
var destination = './projects/';
var _ = require('lodash');
const { Console } = require('console');
var lic = require('../../licenseApp/utils/core.license.util.js');
var crypter = require('../../utils/crypt/crypter');
var schedulerController = require('../../modules/settings/server/controllers/scheduler.server.controller');

//Object to hold all the jobs created using node-schedule
var myJobs = {};

function pullData(data) {
  let Readdata = fs.readFileSync("./licenseApp/utils/activate-data.json");
  var activateConfig = crypter.decryptObject(Readdata.toString());
  var activateData=activateConfig;
  // console.log('this is activate config data:31 - pull data : ', activateConfig);
  !activateConfig.stopScheduler && lic.isValid(function (valid) {
    if(!valid || (!valid && Object.entries(myJobs).length)) {
      schedule.gracefulShutdown().then(() => {
        console.log('schedulers stopped!');
        shutDownGracefully();
      }).catch((e)=>{console.log('this is err : ',e)});
      // console.log('this is activate config data:38 - pull data : is not valid in pull data  ', activateConfig, valid);
    } else {
      var today = new Date();
      
      // this date is used to check if the system date has been tempered or not;
      var activateConfigDate = new Date(activateConfig.date);
      // console.log('this is activate config data:44 - pull data : ', activateConfig, today, activateConfigDate);
      if(today.getDate() !== activateConfigDate.getDate() || today.getMonth() !== activateConfigDate.getMonth() || today.getYear() !== activateConfigDate.getYear()) {
        schedule.gracefulShutdown().then(() => {
          console.log('schedulers stopped!');
          shutDownGracefully();
        }).catch((e)=>{console.log('this is err : ',e)});
        // console.log('this is activate config data:50 - pull data date change : ', activateConfig, today, activateConfigDate);
      } else {
      	console.log('🚀 ~ SCHEDULER CALL ---->', data);
      	var options = {
        	uri: ps_core_server_url + '/api/data/pull',
        	method: 'POST',
        	json: data,
      	};
      	request(options, function (error, response, body) {
        	if (response.statusCode != 200) {
        	  logger.error('Error in pull data');
        	  // response.status(400).send(response.body)
        	} else {
        	  logger.info('Pull started');
        	  // response.send({ message: 'Started pulling data.' })
        	}
      	});
      }
    }
  });
}

// Function to create a node-schedule job
function createJob(data, callback) {
  var job = schedule.scheduleJob({ start: data.scheduleStartTime, rule: data.rule }, function () {
    //Get all schedulers
    Scheduler.findById(data.jobId, function (err, doc) {
      if (err) {
        logger.error('Could not find scheduler with that id');
      } else {
        //Loop through all the tasks
        doc.tasks.forEach(function (task) {
          //Data connection tasks
          if (task.taskType == 'dataConnection') {
            //Fetch the details for this task from db
            DataConnections.findById(task.taskId)
              .populate({ path: 'databaseConnectionId' })
              .populate({ path: 'sftpConnectionId' })
              .populate({ path: 's3ConnectionId' })
              .then(
                function (data) {
                  // Construct object
                  if (data) {
                    let pullDataObj = JSON.parse(JSON.stringify(data));
                    pullDataObj.fileEncoding = null;
                    pullDataObj.dataConnId = data._id;
                    // SFTP
                    if (pullDataObj.source === 'sftp') {
                      pullDataObj.connection = pullDataObj.sftpConnectionId;
                      pullDataObj.port = pullDataObj.sftpConnectionId.port;
                      pullDataObj.address = pullDataObj.sftpConnectionId.address;
                      pullDataObj.username = pullDataObj.sftpConnectionId.username;
                      //! pscore access the password key from connection object also and sometimes from outside connection object
                      //! Will need to refactor it
                      const key = hideandseek.keyFromPassword();
                      pullDataObj.password = hideandseek.decrypt(
                        key,
                        pullDataObj.sftpConnectionId.password
                      );
                      pullDataObj.connection.password = hideandseek.decrypt(
                        key,
                        pullDataObj.sftpConnectionId.password
                      );
                    }
                    // AMAZON S3
                    if (pullDataObj.source === 's3') {
                      pullDataObj.connection = pullDataObj.s3ConnectionId;
                      pullDataObj.bucket = pullDataObj.bucket;
                      pullDataObj.bucketFolderPath = pullDataObj.bucketFolderPath;
                      const key = hideandseek.keyFromPassword();
                      pullDataObj.connection.awsSecretKey = hideandseek.decrypt(
                        key,
                        pullDataObj.s3ConnectionId.awsSecretKey
                      );
                    }
                    // BIGQUERY
                    if (pullDataObj.source === 'bigquery') {
                      pullDataObj.connection = pullDataObj.databaseConnectionId;
                      pullDataObj.database = pullDataObj.databaseName;
                      const key = hideandseek.keyFromPassword();
                      const newKey = hideandseek.decrypt(
                        key,
                        pullDataObj.databaseConnectionId.bqPrivateKey
                      );
                      pullDataObj.connection.bqPrivateKey = newKey.replace(/\\n/g, '\n');
                    }
                    // SNOWFLAKE
                    if (pullDataObj.source === 'snowflake') {
                      pullDataObj.connection = pullDataObj.databaseConnectionId;
                      pullDataObj.database = pullDataObj.databaseName;
                      const key = hideandseek.keyFromPassword();
                      pullDataObj.connection.password = hideandseek.decrypt(
                        key,
                        pullDataObj.databaseConnectionId.password
                      );
                    }
                    // DATABASES (MSSQL, MYSQL, POSTGRESQL) AND URL
                    if (
                      pullDataObj.source === 'mssql' ||
                      pullDataObj.source === 'mysql' ||
                      pullDataObj.source === 'postgresql'
                    ) {
                      pullDataObj.database = pullDataObj.databaseName;
                      pullDataObj.connection = pullDataObj.databaseConnectionId;
                      //Note: Need to change the key generation logic
                      var key = hideandseek.keyFromPassword();
                      pullDataObj.connection.password = hideandseek.decrypt(
                        key,
                        pullDataObj.connection.password
                      );
                      delete pullDataObj.databaseName;
                    }
                    delete pullDataObj.databaseConnectionId;
                    delete pullDataObj.s3ConnectionId;
                    delete pullDataObj.sftpConnectionId;
                    pullData(pullDataObj);
                  }
                },
                function (err) {
                  logger.error('Error occured while fetching data connection' + task.taskId, err);
                }
              );
          }
          if (task.taskType == 'dataFlow') {
            UddFlow.findById(task.taskId).then(
              function (data) {
                var uddFlow = data;
                ProjectConfig.findById(data.projectId).then(
                  function (project) {
                    var name = uploadUtil.costructAbsPath({
                      baseDir: config.projectDir,
                      projectId: project._id,
                    });
                    var basedir = name.replace('undefined', '');
                    var uddParams = {
                      projectId: project._id,
                      createdBy: project.createdBy,
                      basedir: basedir,
                      destination: destination + project._id,
                      dataGroupId: uddFlow.dataGroupId,
                      uniqueFlowId: uddFlow._id,
                      flowId: uddFlow.flowId,
                    };
                    ProjectController.executeFlow(uddParams);
                  },
                  function (err) {
                    logger.error(
                      'Error occured while fetching project details!!' + data.projectId,
                      'error' + err
                    );
                  }
                );
              },
              function (err) {
                logger.error(
                  'Error occured while fetching Udd flow!!' + uddFlow.flowId,
                  'error' + err
                );
              }
            );
          }
        });
      }
    });
  });
  if (job) {
    //Add job to the object once it created succefully
    let Readdata = fs.readFileSync("./licenseApp/utils/activate-data.json");
    var activateConfig = crypter.decryptObject(Readdata.toString());
    var activateData=activateConfig;
    myJobs[data.jobId] = job;
    activateConfig.stopScheduler = false;
    var encryptedJson = crypter.encryptObject(activateConfig);
    fs.writeFileSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'), JSON.stringify(encryptedJson));
    logger.info('Job created with ID:' + data.jobId);
    callback(null, { status: 'created', info: data.jobId });
  } else {
    logger.info('Error while creating the job:' + data.jobId);
    callback({ status: 'failed', info: 'Job creation failed, please check the rule.' }, null);
  }
}

/**
 * function to shutdown all the scheduler jobs gracefully.
 */
function shutDownGracefully() {
  let Readdata = fs.readFileSync("./licenseApp/utils/activate-data.json");
  var activateConfig = crypter.decryptObject(Readdata.toString());
  var activateData=activateConfig;
  // console.log('this is data coming to shutdown gracefully : ', activateConfig, myJobs);
  schedulerController.findAllSchedulers().then(
    function (docs) {
      docs.forEach(function (data) {
        Scheduler.findOneAndUpdate({ _id: data._id }, { "$set": { isStopped: true } }, function (err) {
          if (err) {
            logger.error("Could not Update Scheduler" + ' error: ' + err, { Date: date });
            if (res) {
              res.status(400).send({ message: "Could not Update Scheduler" });
            }
          } else {
            logger.info('Scheduler stopped successfully');
          }
        });
      });
    },
    function (err) {
      console.log(err);
    }
  );
}

function removeJob(data, callback) {
  if (myJobs[data.jobId] && data.isStopped == false) {
    console.log('Cancel the job', myJobs[data.jobId].cancel());
    logger.info('Job deleted successfully');
    delete myJobs[data.jobId];
    callback(null, { status: 'deleted', info: data.jobId });
  } else if (data.isStopped == true) {
    logger.info('Job deleted successfully');
    callback(null, { status: 'deleted', info: data.jobId });
  } else {
    callback({ status: 'failed', info: data.jobId }, null);
  }
}

function pauseJob(data, callback) {
  if (myJobs[data._id]) {
    console.log('Cancel the job', myJobs[data._id].cancel());
    logger.info('Job paused successfully');
    //delete myJobs[data._id];
    callback(null, { status: 'deleted', info: data });
  } else {
    callback({ status: 'failed', info: data._id }, null);
  }
}

//Function to reschedule a job
function reScheduleJob(data, callback) {
  let Readdata = fs.readFileSync("./licenseApp/utils/activate-data.json");
  var activateConfig = crypter.decryptObject(Readdata.toString());
  var activateData=activateConfig;
  if (myJobs[data.jobId]) {
    if (myJobs[data.jobId].reschedule({ start: data.scheduleStartTime, rule: data.rule })) {
      activateConfig.stopScheduler = false;
      var encryptedJson = crypter.encryptObject(activateConfig);
      fs.writeFileSync(path.resolve(__dirname, '../../licenseApp/utils/activate-data.json'), JSON.stringify(encryptedJson));
      logger.info('Job reschedule success');
      callback(null, { status: 'rescheduled', info: data.jobId });
    } else {
      logger.error('Job rescheduling failed.');
      callback({ status: 'failed', info: 'Job rescheduling failed.' }, null);
    }
  } else {
    createJob(
      data,
      callback,
      function (resp) {
        if (err) {
          logger.error('Could not create JOB for Schedule ID:' + data._id);
        } else {
          logger.info('Job created for schedule:' + data.scheduleName);
        }
      },
      function (err) {
        logger.error('Error occured while creating job!!' + data._id, 'error' + err);
      }
    );
  }
}
//Return all the jobs
function listAllJobs() {
  return myJobs;
}
module.exports.createJob = createJob;
module.exports.removeJob = removeJob;
module.exports.reScheduleJob = reScheduleJob;
module.exports.listAllJobs = listAllJobs;
module.exports.pauseJob = pauseJob;
module.exports.shutDownGracefully = shutDownGracefully;
module.exports.myJobs = myJobs;
module.exports.schedule = schedule;
