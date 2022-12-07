/**
 * Created by saurabh b on 17/12/2020.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Notebook schema
var NotebookSchema = new Schema({
    projectPath: {
        type: String
    },
    fileName: {
        type: String
    },
    notebookUrl: {
        type: String
    },
    inputFile: {
        type: String
    },
    notebookInputFileId: {
        type: String
    },
    outputFileDataGroupId: {
        type: String
    },
    addToPipeline: {
        type: Boolean
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

mongoose.model('notebooks', NotebookSchema);