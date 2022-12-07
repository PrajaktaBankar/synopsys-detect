/**
 * Created by vishnu on 02/02/18.
 */
var path = require('path'),
    logger = require(path.resolve('./logger')),
    mongoose = require('mongoose'),
    AuditLog= mongoose.model('auditLog'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller');

exports.logit=function(loginfo)
{
    var auditLog = new AuditLog(loginfo);
    auditLog.save(function(err){
        if(err){
            logger.error("Saving auditlog failed. ",{error: err});
        }else{
            return true;
        }
    });
};

//function to read log from auditlog collection for a specific loggerId
exports.readLog=function(req, res) {
    var defaultStartDate = new Date();
    //setting defaultStartDate value to 3 days back from now
    defaultStartDate.setDate(defaultStartDate.getDate() - 3);
    var startDate = req.query.startDate || new Date(defaultStartDate.setHours(0,0,0,0)).toISOString();
    var endDate = req.query.endDate || new Date().toISOString();
    AuditLog.find({level: 'error', loggerId: req.uddFlow._id, loggerType: 'Uddflow', createdAt: {
            $gte: startDate,
            $lt: endDate
    }}).sort({ createdAt: -1 }).exec(function(err, logsList) {
        if(err){
            return res.status(400).send(err.message);
        }
        res.send(logsList);
    });
};

//function to delete the log related to a specific loggerId
exports.deleteLog=function(req, res) {
    AuditLog.find({level: 'error', loggerId: req.uddFlow._id, loggerType: 'Uddflow'}).deleteMany().then(function() {
        res.send('log deleted successfully!');
    }, function(err) {
        return res.status(400).send(err.message);
    });
};