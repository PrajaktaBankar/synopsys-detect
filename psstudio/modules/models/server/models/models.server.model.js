/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var model = new Schema({
    modelMetaData: {
        type: JSON
    },
    idealPersona: {
        type: JSON
    },
    trainingId: {
        type: Schema.ObjectId,
        ref: 'trainings'
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    isDataSplitted: {
        type: Boolean
    },
    oldModelId: {
        type: Schema.ObjectId
    },
    reTrainFileId: {
        type: Schema.ObjectId,
        ref: 'Files'
    },
    hptPreference: {
        type: JSON
    },
    trainPipeFilePath: {
        type: String
    },
    yHoldout: {
        type: String
    },
    xHoldout: {
        type: String
    },
    yDev: {
        type: String
    },
    xDev: {
        type: String
    },
    yTrain: {
        type: String
    },
    xTrain: {
        type: String
    },
    xTest: {
        type: String
    },
    xDevOriginal: {
        type: String
    },
    xHoldoutOriginal: {
        type: String
    },
    yLabelFilePath: {
        type: JSON
    },
    status: {
        type: String
    },
    message: {
        type: String
    },
    indexPath: {
        type: String
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    retrainSourceType: {
        type: String
    },
    transformedDatasetPath: {
        type: String
    },
    validationStrategy: {
        type: JSON
    },
    edaId: {
        type: Schema.ObjectId,
        ref: 'eda'
    }
});

var Deployment = new Schema({
    Host: {
        type: String
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    projectType: {
        type: String
    },
    modelId: {
        type: Schema.ObjectId,
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

});

mongoose.model('models', model);
mongoose.model('deployment', Deployment);
