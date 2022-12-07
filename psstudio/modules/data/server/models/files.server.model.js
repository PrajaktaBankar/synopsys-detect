/**
 * Created by winjitian on 03/01/20.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//files schema
var FileSchema = new Schema({
    filename: {
        type: String
    },
    // root file name i.e. the original file from which current data was generated.
    initFilename: {
        type: String
    },
    rawFileName: {
        type: String
    },
    description: {
        type: String
    },
    fileEncoding: {
        type: String,
        default: 'utf_8'
    },
    fileSize: {
        type: Number
    },
    fileSchema: {
        type: Array
    },
    descriptiveStatistics: {
        type: Array
    },
    fileSource: {
        type: String
    },
    fileType: {
        type: String
    },
    //willbe an .html file which will contain report about the data file
    fileReportFilename: {
        type: String
    },
    //Number of rows present in the file
    noOfRows: {
        type: String
    },
    noOfCols: {
        type: String
    },
    tasks: {
        type: Array
    },
    //MongoDB _id for uddflows, used to identify the file generated using the flow
    uniqueFlowId: {
        type: Schema.ObjectId
    },
    parentFileId: {
        type: Schema.ObjectId,
        ref: 'Files'
    },
    dataGroupId: {
        type: Schema.ObjectId,
    },
    isParent: {
        type: Boolean,
        default: true
    },
    taExperimentId: {
        type: Schema.ObjectId,
        ref: 'taexperiments'
    },
    edaId: {
        type: Schema.ObjectId,
        ref: 'eda'
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    oldFileId: {
        type: Schema.ObjectId,
        ref: 'Files'
    },
    reTrainingData: {
        type: JSON
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
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
    notebookInputFileId: {
        type: Schema.ObjectId,
    },
    notebooks: {
        type: JSON
    },
    //Eda id of latest eda for the file
    currentEdaId: {
        type: Schema.ObjectId,
        ref: 'eda'
    }
});

// Datagroup schema
var DatagroupSchema = new Schema({
    parentId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    // root file name i.e. the original file from which current data was generated.
    name: {
        type: String
    },
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
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
    oldDataGroupId: {
        type: Schema.ObjectId,
    },
    oldParentId: {
        type: Schema.ObjectId,
    }
});

// Data files schema
var DataconnectionSchema = new Schema({
    projectId: {
        type: Schema.ObjectId,
        ref: 'projectConfig'
    },
    connectionName: {
        type: String
    },
    source: {
        type: String
    },
    dataGroupId: {
        type: Schema.ObjectId,
        ref: 'Datagroup'
        //type: [{ type: Schema.Types.ObjectId, ref: 'Datagroup' }],
    },
    dataflowId: {
        type: Schema.ObjectId,
        ref: 'UddFlow'
    },
    scheduleId: {
        type: Schema.ObjectId,
        ref: 'Scheduler'
        //type: [{ type: Schema.Types.ObjectId, ref: 'Scheduler' }],
    },
    url: {
        type: String
    },
    token: {
        type: String
    },
    urlType: {
        type: String
    },
    dataType: {
        type: String
    },
    databaseConnectionId: {
        type: Schema.ObjectId,
        ref: 'DbConn'
    },
    s3ConnectionId: {
        type: Schema.ObjectId,
        ref: 'DbConn'
    },
    databaseName: {
        type: String
    },
    bucket: {
        type: String
    },
    query: {
        type: String
    },
    lastFetchRowNumber: {
        type: String
    },
    fetchType: {
        type: String
    },
    sftpConnectionId: {
        type: Schema.ObjectId,
        ref: 'SFTPCon'
    },
    folderPath: {
        type: String
    },
    bucketFolderPath: {
        type: String
    },
    fileExtension: {
        type: String
    },
    regex: {
        type: String
    },
    lastFetch: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    dataFormat: {
        type: String,
    },
    oldDataConnectionId: {
        type: Schema.ObjectId,
    }

});

//rawfiles schema
var RawfilesSchema = new Schema({
    fileSource: {
        type: String
    },
    filename: {
        type: String
    },
    fileSize: {
        type: String
    },
    projectId: {
        type: Schema.ObjectId,
    },
    fileEncoding: {
        type: String,
        default: 'utf_8'
    },
    isProcessed: {
        type: String
    },
    dataConnId: {
        type: Schema.ObjectId,
    },
    dataGroupId: {
        type: Schema.ObjectId,
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parsed: {
        type: Boolean,
    },
    message: {
        type: String
    },
    //MongoDB _id for uddflows, used to identify the file generated using the flow
    uniqueFlowId: {
        type: Schema.ObjectId
    },
});

mongoose.model('Files', FileSchema);
mongoose.model('Datagroup', DatagroupSchema);
mongoose.model('Dataconnection', DataconnectionSchema);
mongoose.model('Rawfiles', RawfilesSchema);