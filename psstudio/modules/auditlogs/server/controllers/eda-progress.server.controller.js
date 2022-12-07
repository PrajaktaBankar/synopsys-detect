/**
 * Created by vishnu on 02/02/18.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    auditLogger = require('./auditlog.server.controller'),
    EdaProgress= mongoose.model('edaProgress'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller');

exports.initEdaProgress=function(progressInfo,callback)
{
    var progressInfo = progressInfo;
    var defaultEdaStages = []
    progressInfo.stages = defaultEdaStages;
    var edaProgress = new EdaProgress(progressInfo);
    edaProgress.save(function(err,doc){
        if(err){
            var log = {
                projectId:progressInfo.projectId,
                userId:progressInfo.createdBy,
                level:"error",
                message:"Initializing eda progress info failed."
            }
            auditLogger.logit(log);
            logger.error("Initializing eda progress info failed. ",{error: err});
        }else{
            var log = {
                projectId:progressInfo.projectId,
                userId:progressInfo.createdBy,
                level:"error",
                message:"Initialized eda progress."
            }
            auditLogger.logit(log);
            callback('',doc);
        }
    });
};

exports.updateEdaProgress = function(data){
    EdaProgress.find({_id:data.projectDetails.edaProgressId,projectId:data.projectDetails.projectId},function(err,edaProgress){
        if(err){
            logger.error("Failed to find the eda progress with the given data ",{error: err});
        }
        edaProgress[0].stages.push({stageTitle:data.stageTitle,status:true,stage:data.stage});

        edaProgress[0].markModified('stages');
        EdaProgress.updateOne({_id: data.projectDetails.edaProgressId}, {
            $set:edaProgress[0]
        }, function(err, affected, resp) {
            if(err){
                var log = {
                    projectId:projectDetails.projectId,
                    userId:projectDetails.createdBy,
                    level:"error",
                    message:"Could not update eda progress"
                }
                auditLogger.logit(log);
            }
            EdaProgress.deleteOne({_id : { $ne:mongoose.Types.ObjectId(data.projectDetails.edaProgressId)}},function(err){
                if(err){
                    var log = {
                        projectId:projectDetails.projectId,
                        userId:projectDetails.createdBy,
                        level:"error",
                        message:"Error in deleting previous eda progress"
                    }
                    auditLogger.logit(log);
                    logger.error("Error in deleting previous eda progress", {error: err});
                }
            })
        })
    })

}
exports.list= function(req,res){
    EdaProgress.find({ projectId : req.project._id }).sort({'createdAt':-1}).limit(1).exec(function(err,edaProgress){
        if(err){
            logger.error("Could not find projects", {error: err});
            res.status(400).send({message:"Could not find project"});
        }else{
            res.json(edaProgress);
        }
    })
}

/**
 * Middleware for finding Project Configuration by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.projectById=function(req,res,next,id)
{
    ProjectConfig.findById(id).exec(function(err,project){
        if(err){
            logger.error("Error while finding project configuration", {error: err});
            return next(err);
        }else if(!project){
            return res.status(404).send({message:"No project Configuration with that identifier has been found"});
        }
        req.project = project;
        next();
    })
};

