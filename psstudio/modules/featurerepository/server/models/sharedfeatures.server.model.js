'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    //shared feature schema
var sharedFeature = new Schema({

    email:{
        type:String
    },
    userId:{
        type:Schema.ObjectId,
        ref:'User'
    },
    sharedFeatures:[{ type: Schema.Types.ObjectId, ref: 'FeatureRepository' }],
    projectId:{
        type:Schema.ObjectId,
        ref:'projectConfig'
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

mongoose.model('SharedFeature', sharedFeature);
