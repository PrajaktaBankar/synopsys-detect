/**
 * Created by winjitian on 03/01/20.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ToolkitSchema = new Schema({
    reportName:{
        type: String
    },
    stdDriftPlot:{
        type: JSON
    },
    performancePlot:{
        type:JSON
    },
    incomingCategories:{
        type: JSON
    },
    summary:{
        type: String
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
    modelId:{
        type: Schema.ObjectId,
        ref: 'trainedModel'
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

mongoose.model('Toolkit',ToolkitSchema);