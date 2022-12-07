/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainedModel = new Schema({
    projectId:{
        type: Schema.ObjectId,
        ref:'projectConfig'
    },
    //Is the uploaded file id
    originalFileId:{
        type:Schema.ObjectId,
        ref:'Files'
    },
    //File id of the file which is used in training
    afterEdaFileId:{
        type:Schema.ObjectId,
        ref:'Files'
    },
    edaId:{
        type: Schema.ObjectId,
        ref:'eda'
    },
    textOperations:{
        type:JSON
    },
    categoricalEncoders:{
        type:JSON
    },
    name:{
        type: String
    },
    depVariable:{
        type: String
    },
    indepVariable:{
        type: JSON
    },
    dateColumnSelected:{
        type:JSON
    },
    preprocessedFilepath:{
        type:String
    },
    algorithms:{
        type: JSON
    },
    validationStrategy:{
        type: JSON
    },
    testSize:{
        type: String
    },
    modelMetaData:{
        type:JSON
    },
    noOfFeatures:{
        type:Number
    },
    modelPath:{
        type:String
    },
    modelSize:{
        type:String
    },
    trainDuration:{
        type:Number
    },
    hptPreference:{
      type:JSON
    },
    fileEncoding:{
      type:String
    },
    metaInfo:{
      type:JSON
    },
    classNames:{
        type:JSON
    },
    nlpLanguage:{
        type:String
    },
    nFeatureCount:{
        type:Number
    },
    nlpFeatureExtractionMethod:{
        type:String
    },
    problemType:{
        type:String
    },
    modelDataId:{
        type: Schema.ObjectId,
        ref: 'trainedModelData'
    },
    isMultilabel:{
        type:Boolean
    },
    scalerObj:{
        type:String
    },
    normalizationObj:{
        type:String
    },
    decompositionObj:{
        type:String
    },
    sampling:{
        type: String,
        default:null
    },
    featureScaling:{
        type:String
    },
    normalizationMethod:{
        type:String
    },
    clusteringInfo:{
        type:JSON
    },
    predictiveModelingInfo:{
        type:JSON
    },
    isImbalanced:{
        type:Boolean
    },
    timeseriesInfo:{
        type:JSON
    },
    autoFeatureGenTasks:{
        type:JSON
    },
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('trainedModel', TrainedModel);
