/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var EdaProgressSchema = new Schema({
    projectId:{
        type: Schema.ObjectId,
        ref:'projectConfig'
    },
    stages:{
        type:JSON
    },
    userId:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

mongoose.model('edaProgress', EdaProgressSchema);
