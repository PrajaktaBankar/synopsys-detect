'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    //feature repository schema
var featureRepository = new Schema({

    name:{
        type: String,
        default: '',
        trim: true
    },
    //Function or feature
    type:{
        type:String
    },
    //description about feature or function
    description:{
        type:String
    },
    //function definition
    functionDefinition:{
        type: String
    },
    sharedFileName:{
        type: String
    },
    isFileCreated:{
        type:Boolean
    },
    sharedFeaturesList:{
        type: [{}]
    },
    status:{
        type:String
    },
    sharedIndex:{
        type: Array
    },
    projectId:{
        type:Schema.ObjectId,
        ref:'projectConfig'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isShared:{
        type:Boolean,
        default:false
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

mongoose.model('FeatureRepository', featureRepository);
