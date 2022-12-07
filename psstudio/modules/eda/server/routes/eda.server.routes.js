/**
 * Created by Saket on 17/10/17.
 */

var edaController = require('../controllers/eda.server.controller');
var edaPolicy = require('../policies/eda.server.policy');
var dataController = require('../../../data/server/controllers/data.server.controller');

edaPolicy.invokeRolesPolicies();
module.exports = function (app) {
    app.route('/api/v2/projects/:projectId/eda').all(edaPolicy.isAllowed)
        .get(edaController.list)
        .post(dataController.getSubscriptionDetails, edaController.create);
    app.route('/api/v2/projects/:projectId/eda/done')
        .post(edaController.edaDone)
    app.route('/api/v2/projects/:projectId/eda/feature').all(edaPolicy.isAllowed)
        .post(edaController.getFeatureInfo)
    app.route('/api/v2/projects/:projectId/eda/:edaId/advedainfo').all(edaPolicy.isAllowed)
        .get(edaController.getAdvEdaInfo)
    app.route('/api/v2/projects/:projectId/eda/edagraph').all(edaPolicy.isAllowed)
        .post(edaController.generateEdaGraph)
    app.route('/api/v2/eda/:edaId/edaSummary/download').all(edaPolicy.isAllowed)
        .get(edaController.downloadEdaSummary)
    app.route('/api/v2/eda/:edaId/outlierPreview/download').all(edaPolicy.isAllowed)
        .get(edaController.downloadOutlierPreview)
    app.route('/api/v2/eda/:edaId/imputedDataset/download').all(edaPolicy.isAllowed)
        .get(edaController.downloadImputedDataset)
    app.route('/api/v2/eda/:edaId/adv-eda-report/download').all(edaPolicy.isAllowed)
        .get(edaController.downloadAdvEdaReport)
    app.route('/api/v2/eda/:edaId/info').all(edaPolicy.isAllowed)
        .get(edaController.getEdaInfo)
    app.route('/api/v2/conditionalFiltering').all(edaPolicy.isAllowed)
        .post(edaController.getConditionalFilter)
    app.route('/api/v2/eda/targetList').all(edaPolicy.isAllowed)
        .post(edaController.getTargetList)
    app.route('/api/v2/projects/:projectId/eda/edaByFile')
        .get(edaController.getEdaByFileId)
    app.route('/api/v2/eda/dateFormat').all(edaPolicy.isAllowed)
        .post(edaController.dateFormatValidator)
    app.route('/api/v2/eda/multiTimeseries').all(edaPolicy.isAllowed)
        .post(edaController.multipleTimeseries);
    app.route('/api/v2/resamplingPreview').all(edaPolicy.isAllowed)
        .post(edaController.resamplingPreview);
    app.route('/api/v2/multiple/calculateFrequency').all(edaPolicy.isAllowed)
        .post(edaController.calculateTimeseriesFrequency);
    app.route('/api/v2/eda/timeseriesGroupList').all(edaPolicy.isAllowed)
        .post(edaController.gettimeseriesGroupList);
    app.param('projectId', edaController.projectById);
    app.param('edaId', edaController.edaById);
};
