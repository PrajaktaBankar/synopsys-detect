'use strict';
var path = require('path');
// var EdaProgress = require(path.resolve('./eda-progress.server.controller'));
var EdaProgress = require("../../../auditlogs/server/controllers/eda-progress.server.controller");
var TrainingController = require("../../../training/server/controllers/training.server.controller");
var logger = require(path.resolve('./logger'));
module.exports = function (io, socket) {

  // Send progress messages to respective users when a message is received
  socket.on('edaProgress', function (message) {
    // Save progress to database
    EdaProgress.updateEdaProgress(message)
    // Emit the socket message to the respective user
    var receiver = message.projectDetails.createdBy+message.projectDetails.projectId;
    // io.sockets.in(receiver).emit("edaProgress", message);
    socket.broadcast.to(receiver).emit("edaProgressInfo", message)
  });

  socket.on('featureScore',function(message){
    var data = {
      trainingId:message.trainingId,
      'predictiveModelingInfo.featureScores':message.featureScore
    };
    TrainingController.updateTrainingData(data,function(err,res){
      if(err){
        logger.error("Could not update the featureScores to training DB.", { error: err });
      }else{
        logger.info("Updated feature score");
      }
    })
  })

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
  });
};
