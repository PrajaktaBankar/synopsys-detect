/**
 * Created by neha on 23/07/2020.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// output schema
var OutputSchema = new Schema({
    outputType: {
        type: String
    },
    filename: {
        type: String
    },
    outputDescription: {
        type: String
    },
    outputName: {
        type: String
    },
    edaId: {
        type: Schema.ObjectId
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
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
    }
});

//share output schema
var ShareOutputSchema = new Schema({
    sharedTo: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    outputType: {
        type: String
    },
    outputId: {
        type: Schema.ObjectId,
        ref: 'Output'
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    sharedAt: {
        type: Date,
        default: Date.now
    },
    sharedBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isRemoved: {
        type: Boolean,
        default: false
    }

});

mongoose.model('Output', OutputSchema);
mongoose.model('ShareOutput', ShareOutputSchema);