/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var EdaSchema = new Schema({
    projectId: {
        type: Schema.ObjectId,
        ref: "projectConfig",
    },
    edaMode: {
        type: String,
    },
    isHighDimensional: {
        type: Boolean,
        default: false,
    },
    dimReductionFitSize: {
        type: Number,
    },
    strategies: {
        type: JSON,
    },
    edaSummary: {
        type: JSON,
    },
    correctedData: {
        type: JSON,
    },
    advEdaReportDownloadFilePath: {
        type: String,
    },
    advEdaReportFilePath: {
        type: String,
    },
    outlierPreviewFilepath: {
        type: String,
    },
    edaDuration: {
        type: String,
    },
    afterEdaDataFilePath: {
        type: String,
    },
    categoricalColNames: {
        type: JSON,
    },
    paragraphColNames: {
        type: JSON,
    },
    blankColumn: {
        type: JSON,
    },
    targetFeatures: {
        type: JSON,
    },
    problemType: {
        type: String,
    },
    datetimeColumnName: {
        type: JSON,
    },
    imputedDatasetFilepath: {
        type: String,
    },
    usingGPU: {
        type: Boolean,
        default: false,
    },
    timeseriesInfo: {
        type: JSON,
    },
    stringTransformation: {
        type: JSON,
    },
    edaConditionalFiltering: {
        type: JSON,
    },
    oldEdaId: Schema.ObjectId,
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //target moved to eda module
    depVariable: {
        type: String
    }, dataSetInfo: {
        type: JSON
    }, algoType: {
        type: String
    },
    isMultilabel: {
        type: Boolean
    },
    tasks: {
        type: Array
    },
    classNames: {
        type: JSON
    },
    indexPath: {
        type: String
    },
    //file id for which eda is performed
    fileId: {
        type: Schema.ObjectId,
        ref: "Files"
    },
    isMultipleTimeseries: {
        type: Boolean,
        Default: false,

    },
    timeseriesIds: {
        type: JSON,
    },
    resampling: {
        type: JSON
    },
    lenLongGrp: {
        type: Number
    }


});

var timeseriesGroupSchema = new Schema({
    edaId: {
        type: Schema.ObjectId,
        ref: "eda",
    },
    timeseriesGroupList: {
        type: JSON,
    },
    allowedGroupList: {
        type: JSON,
    },
    rejectedGroupList: {
        type: JSON,
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    projectId: {
        type: Schema.ObjectId,
        ref: "projectConfig",
    },
    modelId: {
        type: Schema.ObjectId,
        ref: "models"
    }
})
mongoose.model("eda", EdaSchema);
mongoose.model("tsGroup", timeseriesGroupSchema)