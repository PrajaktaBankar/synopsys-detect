'use strict';

/**
 * Plans file for the BASIC users.
 */
module.exports = {
    // project management.
    project: {
        limits: {
            // trainingLimit:10,
            projectLimit:5
            // userLimit:2
        },
        // values = 'predictive_modeling', 'timeseries', 'clustering'
        allowedProjectType: ['predictive_modeling', 'timeseries', 'clustering'],
        // values = 'importProject', 'importTemplate', 'projectCreate'
        allowedProjectmanagementActions: ['importTemplate', 'projectCreate']
    },
    // settings module.
    settings: {
        /**
         * values = 'db', 'sftp', 'deploy', 'upload', 'logs', 'pscorenodes', 'user', 'managePlans', 'help', 'report', 'scheduler', 'subscription', 'profile'
         **/
        allowedSettingsOption: ['help', 'subscription', 'profile']
    },
    // data module.
    data: {
        // here we have defined the list of allowed connections.
        dataConnection:{
            // values = 'upload', 'url', 'mssql', 'mysql', 'postgresql','sftp', 'iotsense'
            allowedConnectionList: ['upload'],
            // this is the connection list for enterprise - connection which are addon to pro.
            enterpriseConnectionList: ['url','sftp', 'iotsense']
        },
        // here we have defined the rows and cols allowed for the file upload.
        fileUpload: {
            limits: {
                noOfRowsPermitForBasic: 25000,
                noOfColsPermitForBasic: 15,
                uploadLimit: 3
            }
        }
    },
    // eda module.
    eda: {
        // values = 'splitDataset', 'missingThreshold', 'imputationFeature', 'conditionalFiltering', 'stringTransformation'
        allowedEdaAdvanceOptions: ['splitDataset', 'missingThreshold'],
        edaCount: 2
    },
    // training module.
    training: {
        // values = 'featureGeneration', 'transformation', 'featureReduction', 'sampling', 'hpt', 'nlp', 'visualiseComponent', 'stationarityTest', 'resampling', 'autoCorrelation'
        allowedTrainingAdvanceOptions:['transformation', 'featureReduction', 'hpt', 'visualiseComponent', 'stationarityTest', 'autoCorrelation'],
        algoCount: 3,
        trainingCount: 2
    },
    // user module.
    user: {
        maxInvitations :0,//The BASIC plan subscriber can't invite users
    },
    // model module.
    model: {
        // values = 'pipeline', 'compareModels', 'advanceAlgorithm', 'retrain', 'deployModel', 'downloadModel', 'limeReport', 'rocAucScore', 'liftAndGain', 'prCurve', 'decisionTree', 'crossValidation'
        allowedModelOptions: [],
        quickPrediction: {
            noOfColsPermitForBasic: 20,
            noOfRowsPermitForBasic: 50
        },
        scoring: {
            noOfColsPermitForBasic: 20,
            noOfRowsPermitForBasic: 50
        }
    },
    // side menu items.
    menu: {
        // values = 'Home', 'Data', 'EDA', 'Notebook', 'Text Analysis', 'Train Model', 'Models', 'Data Drift', 'Feature Repo', 'Toolkit', 'Output'
        allowedMenuItems: ['Home', 'Data', 'EDA', 'Train Model', 'Models'],
        // values = 'Data Connection', 'Data Set', 'Data Flow', 'Drift Report', 'Drift Settings'
        allowedSubMenuItems: ['Data Connection', 'Data Set']
    },
    // feedback survey.
    feedback: {
        projectReward: 2
    }
}
