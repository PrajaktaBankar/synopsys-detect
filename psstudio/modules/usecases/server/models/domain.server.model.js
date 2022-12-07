/**
 * Created by neha on 22/03/2021.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

// usecase schema
var DomainSchema = new Schema({
    name: {
        type: String,
        unique:true
    },
    imgPath: {
        type: String
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
});
mongoose.model('Domain', DomainSchema);