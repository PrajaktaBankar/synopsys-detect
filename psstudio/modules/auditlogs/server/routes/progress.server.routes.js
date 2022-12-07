/**
 * Created by Saket on 17/10/17.
 */

var trainModelController=  require('../controllers/eda-progress.server.controller');
var trainModelPolicy = require('../policies/eda-progress.server.policy');

trainModelPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    app.route('/api/projects/:projectId/edaprogress').all(trainModelPolicy.isAllowed)
        .get(trainModelController.list)
    app.param('projectId',trainModelController.projectById);
};
