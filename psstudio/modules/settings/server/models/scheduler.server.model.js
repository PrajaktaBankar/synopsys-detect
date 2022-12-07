/**
 * Created by winjitian on 06/01/2020.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * SchedulerSchema Schema
 */
var SchedulerSchema = new Schema({
    scheduleName: {
        type: String
    },
    scheduleStartTime: {
        type: Date
    },
    scheduleDate:{
        type: Date
    },
    scheduleTime:{
        type: Date
    },
    recurType: {
        type: String
    },
    recurValue: {
        type: String,
    },
    recurTimeHour:{
        type: String
    },
    recurTimeMinute:{
        type:String
    },
    rule:{
        type:String
    },
    tasks:[{taskType:'string',taskId: Schema.ObjectId}],
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isStopped : {
        type: Boolean,
        default: false
    }
});
mongoose.model('Scheduler', SchedulerSchema);
