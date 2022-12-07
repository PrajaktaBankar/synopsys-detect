/**
 * Created by saurabh b on 17/12/2020.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Notebook schema
var ExperimentsSchema = new Schema({
    experimentName: {
        type: String
    },
    taskConfig: {
        type: JSON
    },
    taFeatureConfig: {
        type:JSON
    },
    fileId: {
        type: Schema.ObjectId,
        ref: 'Files'
    },
    feature: {
        type: String
    },
    inputText: {
        type: String
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String
    },
    oldExperimentId: {
        type: Schema.ObjectId
    }
});

mongoose.model('taexperiments', ExperimentsSchema);