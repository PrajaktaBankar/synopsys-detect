/**
 * Created by vishnu on 03/01/20.
 */

var dataDriftController = require('../controllers/datadrift.server.controller');
var trainedModelController = require('../../../training/server/controllers/training.server.controller');
var edaController = require('../../../eda/server/controllers/eda.server.controller');
var dataDriftPolicy = require('../policies/datadrift.server.policy');

dataDriftPolicy.invokeRolesPolicies();
module.exports = function (app) {
    app.route('/api/v2/projects/:projectId/datadrift/list').all(dataDriftPolicy.isAllowed)
        .get(dataDriftController.list);
    app.route('/api/v2/projects/:projectId/datadrift/:driftReportId').all(dataDriftPolicy.isAllowed)
        .get(dataDriftController.listOne)
        .delete(dataDriftController.deleteReport);
    app.route('/api/v2/training/:trainingId/models/:modelId/datadrift/start').all(dataDriftPolicy.isAllowed)
        .post(edaController.findEdaById, dataDriftController.startDriftAnalysis);
    app.route('/api/data/driftAnalysis/done')
        .post(dataDriftController.driftAnalysisDone);
    app.route('/api/v2/projects/:projectId/driftConfig').all(dataDriftPolicy.isAllowed)
        .post(dataDriftController.insertDriftConfig);
    app.route('/api/v2/projects/:projectId/config').all(dataDriftPolicy.isAllowed)
        .get(dataDriftController.getAllDriftConfigs);
    app.route('/api/v2/projects/:projectId/delete/:configId').all(dataDriftPolicy.isAllowed)
        .delete(dataDriftController.deleteConfig);
    app.route('/api/v2/projects/:projectId/update/:configId').all(dataDriftPolicy.isAllowed)
        .put(dataDriftController.updateConfig);

    app.param('driftReportId', dataDriftController.dataDriftById);
    app.param('trainingId', trainedModelController.trainingById);
};
