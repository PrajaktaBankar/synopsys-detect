/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuditlogSchema = new Schema({
    //Json object to store node's info of node-red
    metaData:{
        type: JSON
    },
    projectId:{
        type: Schema.ObjectId,
        ref:'projectConfig'
    },
    level:{
        type:String
    },
    message:{
        type:String
    },
    userId:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    loggerId:{
        type: Schema.ObjectId
    },
    loggerType:{
        type:String
    }
});

mongoose.model('auditLog', AuditlogSchema);
