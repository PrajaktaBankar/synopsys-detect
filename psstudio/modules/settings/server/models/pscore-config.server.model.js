/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Config Schema
 */
var PsCoreConfigSchema = new Schema({

    machineName:{
        type: String,
        unique:true
    },
    machineAddress:{
        type: String
    },
    logFilePath:{
        type:String
    },
    isActivated:{
        type:Boolean,
        default:false
    },
    isGpuAvailable:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});
mongoose.model('PsCoreConfig', PsCoreConfigSchema);
