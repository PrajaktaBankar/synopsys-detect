/**
 * Created by vishnu on 21/03/18.
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
var ConfigSchema = new Schema({

    smtpConfig:{
        type:JSON
    },
    smsConfig:{
        type:JSON
    },
    zigbeeConfig: {
        type: JSON
    },
    remoteConfig: {
        type: JSON
    },
    compressionConfig:{
        type: JSON
    },
    purgeConfig:{
      type:JSON
    },
    deviceIdConfig:{
        type:JSON
    },
    menuConfig:{
        type:JSON
    },
    id: false
});
ConfigSchema.set('toObject', {getters: true});
ConfigSchema.set('toJSON', {getters: true});
mongoose.model('Config', ConfigSchema);
