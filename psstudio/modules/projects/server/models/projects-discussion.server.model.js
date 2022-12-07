/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var projectDiscussionSchema = new Schema({
    message:{
        type: String
    },
    projectId:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    displayName:{
        type:String
    },
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('ProjectDiscussion', projectDiscussionSchema);
