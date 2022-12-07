/**
 * Created by vishnu on 17/05/18.
 */

var trainedModelController = require('../controllers/model.server.controller');
var trainedModelPolicy = require('../policies/model.server.policy');
var settingsController = require('../../../settings/server/controllers/settings.server.controller');
var dataController = require('../../../data/server/controllers/data.server.controller');
var edaController = require('../../../eda/server/controllers/eda.server.controller');

trainedModelPolicy.invokeRolesPolicies();
module.exports = function (app) {
    app.route('/api/projects/:projectId/models').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.list);
    app.route('/api/projects/:projectId/training/list').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.getTrainingList);
    app.route('/api/training/:trainingId/models/list').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.getModels);
    app.route('/api/projects/:projectId/models/analysisReport/graph').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.analysisReport);
    app.route('/api/training/:trainingId/models/:modelId/analysis_report/report').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.analysisReportJson);
    app.route('/api/models/:modelId/download_only_sav_file').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.download);
    app.route('/api/training/:trainingId/models/:modelId/download').all(trainedModelPolicy.isAllowed)
        .get(dataController.findOne, dataController.findNotebookInputFile, trainedModelController.downloadToolkit);
    app.route('/api/training/:trainingId/models/:modelId/deploy/:hostId').all(trainedModelPolicy.isAllowed)
        .get(dataController.findOne, dataController.findNotebookInputFile, trainedModelController.downloadToolkit);
    app.route('/api/prediction/:predictionId/download').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.downloadPrediction);
    app.route('/api/models/:modelId/analysisReport/download').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.downloadAnalysisReport);
    app.route('/api/training/:trainingId/models/:modelId/report/classification').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.generateClassificationReport);
    app.route('/api/prediction/:predictionId/read').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.readPredictionResult);
    app.route('/api/training/:trainingId/models/:modelId').all(trainedModelPolicy.isAllowed)
        .delete(trainedModelController.delete);
    app.route('/api/training/:trainingId/models/:modelId/cv').all(trainedModelPolicy.isAllowed)
        .get(dataController.findOne, trainedModelController.updateCVStatus, trainedModelController.runCV);
    app.route('/api/models/:modelId/cv/done')
        .post(trainedModelController.doneCV);
    app.route('/api/training/:trainingId/models/:modelId/doprediction').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, dataController.getSubscriptionDetails, edaController.findEdaById, trainedModelController.doPrediction);
    app.route('/api/prediction/done')
        .post(trainedModelController.predictionDone);
    app.route('/api/training/:trainingId/models/:modelId/cm/read').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getConfusionMatrix)
    app.route('/api/training/:trainingId/models/:modelId/rl_plot/read').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getRegressionLinePlot)
    app.route('/api/training/:trainingId/models/:modelId/graph/rocauc').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getRocAucCurveGraph)
    app.route('/api/training/:trainingId/models/:modelId/graph/liftgain').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getLiftGainGraph)

    app.route('/api/training/:trainingId/models/:modelId/graph/prcurve').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getPRCurve)

    app.route('/api/training/:trainingId/models/:modelId/graph/learning_curve').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.getLearningGraph)
    app.route('/api/training/:trainingId/models/:modelId/report/lime_report').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getLimeReport);
    app.route('/api/training/:trainingId/scoring/data').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.uploadScoringData);
    app.route('/api/training/:trainingId/models/:modelId/scoring/do').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, dataController.getSubscriptionDetails, edaController.findEdaById, trainedModelController.doScoring);
    app.route('/api/training/:trainingId/models/:modelId/holdout').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, trainedModelController.doHoldout);
    app.route('/api/training/:trainingId/models/:modelId/timeseries/forecast').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.generateForcastingGraph);
    app.route('/api/training/:trainingId/models/:modelId/timeseries/evaluate_forecast').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.evaluateForecastGraph);
    app.route('/api/training/:trainingId/models/:modelId/clustering/visualize').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.generateClusterVisualization);
    
    // Reads the cluster html file and send the response to UI for rendering
    app.route('/api/projects/:projectId/clustering/visualize/scatterplot').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.getClusterHtml);

    app.route('/api/training/:trainingId/models/:modelId/clustering/decisionTree').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.generateClusterDecisionTree);

    app.route('/api/training/:trainingId/models/:modelId/clustering/heatMap').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.generateClusterHeatMap);

    app.route('/api/training/:trainingId/models/:modelId/qp/populate_form_data').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.populateQpFormData);

    app.route('/api/training/:trainingId/get_pipelinetasks').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.getPipelineTasks);
    app.route('/api/training/:trainingId/get_pipelinetask/details').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.getPipelineTaskDetails);
    app.route('/api/models/:modelId/graph/decision_tree').all(trainedModelPolicy.isAllowed)
        .post(dataController.findOne, edaController.findEdaById, trainedModelController.getDecisionTree)

    app.route('/api/projects/:projectId/decisionTree/download/:fileName').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.downloadFile);

    app.route('/api/projects/:projectId/LimeReport/download/:fileName').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.downloadLimeReport);

    app.route('/api/models/insertDeployment').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.insertDeployment);
    app.route('/api/models/:modelId/featureImpact').all(trainedModelPolicy.isAllowed)
        .get(trainedModelController.featureImpactGraph);

    app.route('/api/models/:modelId/featureDistribution').all(trainedModelPolicy.isAllowed)
        .post(edaController.findEdaById, trainedModelController.featureDistribution);
    app.route('/api/models/:modelId/update').all(trainedModelPolicy.isAllowed)
        .post(trainedModelController.updateModel);
    app.param('hostId', settingsController.settingById);
    app.param('predictionId', trainedModelController.predictionById);
    app.param('modelId', trainedModelController.modelById);
    app.param('projectId', trainedModelController.projectById);
};
