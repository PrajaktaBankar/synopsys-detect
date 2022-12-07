/**
 * Created by vishnu on 22/11/18.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var uddFlow = new Schema({

    flowName: {
        type: String,
        default: '',
        trim: true,
        unique: true,
        required: 'Please enter flow name'
    },
    flowId: {
        type: String
    },
    oldFlowId: Schema.ObjectId,
    flowType: {
        type: String
    },
    scheduleId: {
        type: Schema.ObjectId,
        ref: 'Scheduler'
        //type: [{ type: Schema.Types.ObjectId, ref: 'Scheduler' }],
    },
    dataGroupId: {
        type: Schema.ObjectId
        //type: [{ type: Schema.Types.ObjectId, ref: 'Scheduler' }],
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    isOn: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    filename: {
        type: String
    }
});

mongoose.model('UddFlow', uddFlow);
