/**
 * Created by amul on 19/03/21.
 */
let mongoose = require('mongoose'),
Schema = mongoose.Schema;

let taModelSchema = new Schema({
    modelName:{
        type: String
    },
    oldModelFileName:{
        type: String
    },
    frameWork:{
        type:String
    },
    taskType:{
        type:JSON
    },
    nerLabels:{
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

mongoose.model('taModel', taModelSchema);
