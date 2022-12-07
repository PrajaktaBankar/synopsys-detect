/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name:{
        type: String
    },
    type:{
        type: String
    },
    filename:{
        type: String
    },
    originalFileName:{
        type:String
    },
    fileSize:{
      type:Number
    },
    fileType:{
        type:String
    },
    fileEncoding:{
        type:String,
        default:'utf_8'
    },
    stdThreshold:{
        type:Number
    },
    predictionFileMetaData:{
        type:JSON
    },
    projectStatus:{
        type:String
    },
    projectStatusDetails:{
        type:JSON
    },
    projectDescription:{
        type: String
    },
    uploadCount:{
        type:Number,
        default:0
    },
    edaCount:{
        type:Number,
        default:0
    },
    trainingCount:{
        type:Number,
        default:0
    },
    flowId:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    useGPU:{
        type:Boolean,
        default:false
    },
    sharedWith:{
        type:[{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    createdBy:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isImported:{
        type:Boolean,
        default:false
    },
    basedir: {
        type:String
    }
});

mongoose.model('projectConfig', ProjectSchema);
