/**
 * Created by winjitian on 30/06/2020.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * DbConnSchema Schema
 */
var SFTPSchema = new Schema({

    name: {
        type: String
    },
    address: {
        type: String
    },
    port: {
        type: Number,
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('SFTPCon', SFTPSchema);
