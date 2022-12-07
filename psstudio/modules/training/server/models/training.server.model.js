/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var training = new Schema({
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    //Is the uploaded file id
    originalFileId: {
        type: Schema.ObjectId,
        ref: 'Files'
    },
    oldTrainingId: {
        type: Schema.ObjectId
    },
    //File id of the file which is used in training
    afterEdaFileId: {
        type: Schema.ObjectId,
        ref: 'Files'
    },
    edaId: {
        type: Schema.ObjectId,
        ref: 'eda'
    },
    scoringDataFilePath: {
        type: String
    },
    scoringfileEncoding: {
        type: String
    },
    algoType: {
        type: String
    },
    textOperations: {
        type: JSON
    },
    categoricalEncoders: {
        type: JSON
    },
    ordinalEncoderMap: {
        type: JSON
    },
    name: {
        type: String
    },
    depVariable: {
        type: String
    },
    indepVariable: {
        type: JSON
    },
    dateColumnSelected: {
        type: JSON
    },
    preprocessedFilepath: {
        type: String
    },
    algorithms: {
        type: JSON
    },
    validationStrategy: {
        type: JSON
    },
    testSize: {
        type: String
    },
    modelMetaData: {
        type: JSON
    },
    noOfFeatures: {
        type: Number
    },
    modelPath: {
        type: String
    },
    modelSize: {
        type: String
    },
    trainDuration: {
        type: Number
    },
    fileEncoding: {
        type: String
    },
    metaInfo: {
        type: JSON
    },
    classNames: {
        type: JSON
    },
    problemType: {
        type: String
    },
    modelDataId: {
        type: Schema.ObjectId,
        ref: 'trainedModelData'
    },
    isMultilabel: {
        type: Boolean
    },
    sampling: {
        type: String,
        default: null
    },
    featureScaling: {
        type: String
    },
    normalizationMethod: {
        type: String
    },
    clusteringInfo: {
        type: JSON
    },
    predictiveModelingInfo: {
        type: JSON
    },
    isImbalanced: {
        type: Boolean
    },
    timeseriesInfo: {
        type: JSON
    },
    autoFeatureGenTasks: {
        type: JSON
    },
    logTransformationColumns: {
        type: JSON
    },
    scalarValue: {
        type: Number
    },
    status: {
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
    dropOriginal: {
        type: Boolean,
        default: false
    },
    samplingPercentage: {
        type: JSON

    },
    nlpConfigs: {
        type: JSON
    },
    dateComponent: {
        type: JSON
    },
    targetType: {
        type: String
    },
    nSteps: {
        type: Number
    },
    hptPreference: {
        type: JSON
    }
});

mongoose.model('trainings', training);
