/**
 * Created by neha on 22/03/2021.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// usecase schema
var UsecaseSchema = new Schema({
    title: {
        type: String
    },
    domain: {
        type: String
    },
    objectives: {
        type: String
    },
    description: {
        type: String
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    trainingId: {
        type: Schema.ObjectId,
        ref: 'trainings'
    },
    modelId: {
        type: Schema.ObjectId,
        ref: 'models'
    },
    tag: {
        type: String
    },
    outcome: {
        type: JSON
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
    usecaseType: {
        type: String,
    },
    reportFile: {
        type: String,  
    },
    dataInfo: {
        type : JSON
    },
    idealPersona : {
        type : JSON
    }

});
mongoose.model('Usecase', UsecaseSchema);