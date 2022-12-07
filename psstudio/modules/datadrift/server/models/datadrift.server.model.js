/**
 * Created by winjitian on 03/01/20.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DataDriftSchema = new Schema({
    reportName:{
        type: String
    },
    conceptDrift: {
        type: JSON
    },
    dataDrift: {
        type:JSON
    },
    featureList:{
        type: JSON
    },
    summary:{
        type: JSON
    },
    oldDriftReportId:{
        type: Schema.ObjectId
    },
    projectId:{
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    incomingFileId:{
        type: Schema.ObjectId,
        ref:'Files'
    },
    edaId:{
        type: Schema.ObjectId,
        ref:'Eda'
    },
    trainingId:{
        type: Schema.ObjectId,
        ref: 'trainings'
    },
    modelId:{
        type:Schema.ObjectId,
        ref: 'models'
    },
    modelPath:{
        type: String
    },
    algoType:{
        type: String
    },
    type:{
        type: String
    },
    depVariable:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    isDrifted:{
        type: Boolean
    },
    createdBy:{
        type: Schema.ObjectId,
        ref:'User'
    }
});

var DriftConfigSchema = new Schema({
    configName:{
        type: String
    },
    oldDriftConfigId : {
        type: Schema.ObjectId
    },
    projectId:{
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    algoType:{
        type: String
    },
    conceptDrift : {
        type: JSON,
    },
    dataDrift : {
        type: JSON,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type: Schema.ObjectId,
        ref:'User'
    }
});

mongoose.model('DataDrift',DataDriftSchema);
mongoose.model('DriftConfig',DriftConfigSchema);
