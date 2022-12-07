var featurerepositoryController=  require('../controllers/featurerepository.server.controller');
var featurerepositoryPolicy = require('../policies/featurerepository.server.policy');
featurerepositoryPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    app.route('/api/projects/:projectId/feature_repo/share_features').all(featurerepositoryPolicy.isAllowed)
        .get(featurerepositoryController.list)
        .put(featurerepositoryController.delete);
    app.route('/api/projects/:projectId/feature_repo/:edaId/share_features').all(featurerepositoryPolicy.isAllowed)
        .post(featurerepositoryController.create)
    app.route('/api/projects/:projectId/feature_repo/share_features/share').all(featurerepositoryPolicy.isAllowed)
        .post(featurerepositoryController.share);
    app.route('/api/projects/:projectId/feature_repo/share_features/:userId/share_from_py')
        .post(featurerepositoryController.share);
    app.route('/api/feature_repo/share_features/:featureId/done')
        .post(featurerepositoryController.done);
    app.route('/api/projects/:projectId/feature_repo/shared_features').all(featurerepositoryPolicy.isAllowed)
        .get(featurerepositoryController.listSharedFeatures);
    app.route('/api/projects/:projectId/feature_repo/:edaId/use_shared_features/:featureId').all(featurerepositoryPolicy.isAllowed)
        .post(featurerepositoryController.useSharedFeatures)
        .put(featurerepositoryController.confirmMerge);
    //API to REGISTER a function
    app.route('/api/feature_repo/register_function')
        .post(featurerepositoryController.registerFunction)
        
    app.param('featureId',featurerepositoryController.featureById);
};
