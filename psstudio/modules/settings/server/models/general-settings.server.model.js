var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var GeneralSettings = new Schema({
    hostName:{
        type:String,
        unique:true
    },
    url:{
        type:String,
        unique:true
    },
    type:{
        type:String
    },
    createdBy:{
        type:Schema.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
mongoose.model('settings',GeneralSettings);
