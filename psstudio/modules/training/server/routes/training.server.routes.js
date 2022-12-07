/**
 * Created by vishnu on 17/10/17.
 */

var trainModelController = require('../controllers/training.server.controller');
var trainModelPolicy = require('../policies/training.server.policy');
var dataController = require('../../../data/server/controllers/data.server.controller');
var edaController = require('../../../eda/server/controllers/eda.server.controller');
trainModelPolicy.invokeRolesPolicies();
module.exports = function (app) {
    app.route('/api/v2/projects/:projectId/trainmodel').all(trainModelPolicy.isAllowed)
        .get(trainModelController.list)
        .post(dataController.getSubscriptionDetails, trainModelController.create);
    app.route('/api/v2/training/:trainingId').all(trainModelPolicy.isAllowed)
        .delete(trainModelController.delete)
        .get(trainModelController.findOne)
    app.route('/api/v2/projects/:projectId/timeseries/trainmodel').all(trainModelPolicy.isAllowed)
        .post(dataController.getSubscriptionDetails, trainModelController.timeserisConfigCreate);
    app.route('/api/v2/projects/:projectId/clustering/trainmodel').all(trainModelPolicy.isAllowed)
        .post(dataController.getSubscriptionDetails, trainModelController.clusteringConfigCreate);
    app.route('/api/v2/projects/:projectId/clustering/trainmodel/:trainingId/done')
        .post(trainModelController.trainingDone);
    app.route('/api/v2/projects/:projectId/timeseries/trainmodel/:trainingId/done')
        .post(trainModelController.trainingDone);
    app.route('/api/v2/projects/:projectId/trainmodel/correlation')
        .post(trainModelController.calculateCorrelation)
    app.route('/api/v2/projects/:projectId/trainmodel/hypothesistesting-result')
        .post(trainModelController.calculatedCorrelation)
    app.route('/api/v2/projects/:projectId/graph/trainmodel/scatter').all(trainModelPolicy.isAllowed)
        .post(trainModelController.getCorrelationGraphData)
    app.route('/api/v2/projects/:projectId/report/trainmodel/multiunivariate').all(trainModelPolicy.isAllowed)
        .post(trainModelController.getMultiVariateUnivariateAnalysis)
    app.route('/api/v2/projects/:projectId/predictive_model/trainmodel/:trainingId/done')
        .post(trainModelController.trainingDone)
    // .post(dataController.findOneAndUpdate,trainModelController.isModelDataSaved,trainModelController.saveModelData,trainModelController.trainingDone)
    app.route('/api/v2/training/:trainingId/model/:modelId/tune').all(trainModelPolicy.isAllowed)
        .post(edaController.findEdaById, trainModelController.tuneModel)
    app.route('/api/v2/training/:trainingId/models/:modelId/retrain').all(trainModelPolicy.isAllowed)
        .post(dataController.findOne, trainModelController.reTrainModel)
    app.route('/api/v2/advtrainmodel/:trainingId/models/:modelId').all(trainModelPolicy.isAllowed)
        .post(edaController.findEdaById, trainModelController.advTrainModel)
    app.route('/api/v2/projects/:projectId/timeseries/preprocessing').all(trainModelPolicy.isAllowed)
        .post(trainModelController.doTimeseriesPreProcess)
    app.route('/api/v2/projects/:projectId/timeseries/graphanalysis').all(trainModelPolicy.isAllowed)
        .post(trainModelController.doTimeseriesGraphAnalysis)
    app.route('/api/v2/projects/:projectId/predictive/target_details').all(trainModelPolicy.isAllowed)
        .post(trainModelController.getTargetDetails)
    app.route('/api/v2/projects/:projectId/predictive/calculate_feature_score').all(trainModelPolicy.isAllowed)
        .post(trainModelController.calculateFeatureScore)
    app.route('/api/v2/projects/:projectId/timeseries/visualize/component').all(trainModelPolicy.isAllowed)
        .post(trainModelController.visualizeComponent)
    app.route('/api/v2/projects/:projectId/timeseries/visualize/autocorrelation').all(trainModelPolicy.isAllowed)
        .post(trainModelController.autoCorrelationGraph)
    app.route('/api/v2/projects/:projectId/clustering/visualize/optimise_clusters').all(trainModelPolicy.isAllowed)
        .post(trainModelController.optimiseCluster)
    app.route('/api/v2/projects/:projectId/timeseries/stationarity_test').all(trainModelPolicy.isAllowed)
        .post(trainModelController.stationarityTest)
    app.route('/api/v2/projects/:projectId/training/sampling_percentage').all(trainModelPolicy.isAllowed)
        .post(trainModelController.calculateSampling);
    app.route('/api/v2/training/feature/unique_categories').all(trainModelPolicy.isAllowed)
        .post(trainModelController.getUniqueCategories);
    app.param('trainingId', trainModelController.trainingById);
    app.param('projectId', trainModelController.projectById);
};