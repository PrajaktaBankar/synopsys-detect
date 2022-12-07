/**
 * Created by vishnu on 03/01/20.
 */

var toolkitController=  require('../controllers/toolkit.server.controller');
var trainedModelController = require('../../../training/server/controllers/training.server.controller');
var edaController = require('../../../eda/server/controllers/eda.server.controller');
var toolkitPolicy = require('../policies/toolkit.server.policy');

toolkitPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    // app.route('/api/v2/projects/:projectId/datadrift').all(toolkitPolicy.isAllowed)
    //     .get(toolkitController.list);
    // app.route('/api/v2/projects/:projectId/datadrift/:driftReportId').all(toolkitPolicy.isAllowed)
    //     .get(toolkitController.listOne)
    //     .delete(toolkitController.delete);
    // app.route('/api/v2/projects/:projectId/model/:modelId/datadrift/start').all(toolkitPolicy.isAllowed)
    //     .post(trainedModelController.findReTrainModelData, edaController.findEdaById, toolkitController.startDriftAnalysis);
    // app.route('/api/data/driftAnalysis/done')
    //     .post(toolkitController.driftAnalysisDone);

    // app.param('driftReportId',toolkitController.dataDriftById);
    // app.param('modelId',trainedModelController.modelById);
};
