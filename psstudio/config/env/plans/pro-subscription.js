'use strict';

/**
 * Plans file for the PRO users.
 */
module.exports = {
    // project management.
    project: {
        limits: {
            // trainingLimit:10,
            projectLimit: 20,
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
         * values = 'db', 'sftp', 'deploy', 'upload', 'logs', 'pscorenodes', 'user', 'help', 'managePlans', 'report', 'scheduler', 'subscription', 'profile'
         **/
        allowedSettingsOption: ['db', 'help', 'user', 'subscription', 'profile'],
    },
    // data module.
    data: {
        // here we have defined the list of allowed connections.
        dataConnection: {
            // values = 'upload', 'url', 'mssql', 'mysql', 'postgresql','sftp', 'iotsense'
            allowedConnectionList: ['upload', 'mysql', 'mssql', 'postgresql'],
            // this is the connection list for enterprise - connection which are addon to pro.
            enterpriseConnectionList: ['url', 'sftp', 'iotsense'],
        },
        // here we have defined the rows and cols allowed for the file upload.
        fileUpload: {
            limits: {
                noOfRowsPermitForPro: 150000,
                noOfColsPermitForPro: 20,
                uploadLimit: 5,
            },
        },
    },
    // eda module.
    eda: {
        // values = 'splitDataset', 'missingThreshold', 'imputationFeature', 'conditionalFiltering', 'stringTransformation'
        allowedEdaAdvanceOptions: ['splitDataset', 'missingThreshold', 'imputationFeature', 'conditionalFiltering', 'stringTransformation', 'resampling'],
        edaCount: 4
    },
    // training module.
    training: {
        // values = 'featureGeneration', 'transformation', 'featureReduction', 'sampling', 'hpt', 'nlp', 'visualiseComponent', 'stationarityTest', 'resampling', 'autoCorrelation'
        allowedTrainingAdvanceOptions: ['featureGeneration', 'transformation', 'featureReduction', 'sampling', 'hpt', 'nlp', 'visualiseComponent', 'stationarityTest', 'autoCorrelation'],
        algoCount: 3,
        trainingCount: 4
    },
    // user module.
    user: {
        maxInvitations: 5,//The PRO subscriber can invite maximum of 5 users
    },
    // model module.
    model: {
        // values = 'pipeline', 'compareModels', 'advanceAlgorithm', 'retrain', 'deployModel', 'downloadModel', 'limeReport', 'rocAucScore', 'liftAndGain', 'prCurve', 'decisionTree', 'crossValidation'
        allowedModelOptions: ['pipeline', 'advanceAlgorithm', 'limeReport', 'rocAucScore', 'liftAndGain', 'prCurve', 'decisionTree', 'crossValidation'],
        quickPrediction: {
            noOfColsPermitForPro: 20,
            noOfRowsPermitForPro: 150
        },
        scoring: {
            noOfColsPermitForPro: 20,
            noOfRowsPermitForPro: 150
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
