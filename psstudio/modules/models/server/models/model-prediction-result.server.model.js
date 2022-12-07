/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PredictionResultModel = new Schema({
    projectId:{
        type: Schema.ObjectId,
        ref:'projectConfig'
    },
    trainingId:{
        type: Schema.ObjectId,
        ref:'trainedModel'
    },
    predictionFile:{
        type: String
    },
    predictionFileMetaData:{
        type: JSON
    },
    predictionResultFile:{
        type: String
    },
    predictionResult:{
        type:JSON
    },
    algoName:{
        type: String
    },
    mName:{
        type: String
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

mongoose.model('predictionResultModel', PredictionResultModel);
