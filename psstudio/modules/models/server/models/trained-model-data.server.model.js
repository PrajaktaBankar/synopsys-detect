/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainedModelData = new Schema({
    projectId:{
        type: Schema.ObjectId,
        ref:'projectConfig'
    },
    modelId:{
        type: Schema.ObjectId,
        ref:'trainedModel'
    },
    oldModelMetaDataId:{
        type: Schema.ObjectId,
        ref:'trainedModelData'
    },
    xTrain:{
        type:JSON
    },
    xTest:{
        type:JSON
    },
    xHoldout:{
        type:JSON
    },
    yTrain:{
        type:JSON
    },
    yHoldout:{
        type:JSON
    },
    xDev:{
        type:JSON
    },
    yDev:{
        type:JSON
    },
    xDevOriginal:{
        type:String
    },
    xHoldoutOriginal:{
        type:String
    },
    yLabelFilePath:{
        type:JSON
    },
    trainPipeFilePath:{
        type:JSON
    },
    dfAnalysisReport:{
        type:JSON
    },
    exogVariables:{
        type:JSON
    },
    miscData:{
        type:JSON
    },
    featuresListFilePath:{
        type:JSON
    },
    scoringDataFilePath:{
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

mongoose.model('trainedModelData', TrainedModelData);
