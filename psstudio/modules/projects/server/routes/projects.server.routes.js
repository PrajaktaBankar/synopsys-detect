/**
 * Created by winjitian on 17/10/17.
 */

var projectController = require('../controllers/projects.server.controller');
var projectPolicy = require('../policies/projects.server.policy');
var schedulerController = require('../../../settings/server/controllers/scheduler.server.controller')
var licenseController = require('../../../../licenseApp/controllers/license.server.controller');
var dataController = require('../../../data/server/controllers/data.server.controller');
projectPolicy.invokeRolesPolicies();
module.exports = function (app) {
    app.route('/api/projects').all(projectPolicy.validateToken, projectPolicy.isAllowed)
        .get(projectController.list)
        .post(dataController.getSubscriptionDetails, projectController.create);

    app.route('/api/projects/:projectId/data').all(projectPolicy.isAllowed)
        .post(projectController.upload);

    app.route('/api/projects/:projectId/data/pull').all(projectPolicy.isAllowed)
        .post(projectController.pullData);

    app.route('/api/projects/:projectId/data/pull/done')
        .post(projectController.pullDataDone);

    app.route('/api/projects/:projectId/share').all(projectPolicy.isAllowed)
        .post(projectController.shareProject);

    app.route('/api/projects/:projectId/discuss').all(projectPolicy.isAllowed)
        .get(projectController.listConversation)
        .post(projectController.createMessage);
    app.route('/api/projects/:projectId/discuss/:messageId').all(projectPolicy.isAllowed)
        .delete(projectController.deleteConversation)
    app.route('/api/projects/:projectId/merge').all(projectPolicy.isAllowed)
        .post(projectController.mergeData);

    app.route('/api/projects/:projectId/data/read').all(projectPolicy.isAllowed)
        .post(projectController.readFileData);

    app.route('/api/projects/:projectId').all(projectPolicy.isAllowed)
        .get(projectController.read)
        .delete(schedulerController.findSchedulerById, projectController.delete)
        .put(projectController.update);
    app.route('/api/projects/:projectId/report')
        .post(projectController.reportStatus)

    app.route('/api/projects/:projectId/export')
        .get(projectController.exportProject).all(projectPolicy.isAllowed)
    app.route('/api/projects/:projectId/download')
        .get(projectController.downloadProject).all(projectPolicy.isAllowed)

    app.route('/api/project/import')
        .post(dataController.getSubscriptionDetails, projectController.importProject).all(projectPolicy.isAllowed)

    app.route('/api/project/licenseInfo')
        .get(licenseController.licenseData).all(projectPolicy.isAllowed)
    app.route('/api/v2/project/projectCount').all(projectPolicy.isAllowed)
        .get(dataController.getSubscriptionDetails, projectController.getProjectCount)
    app.param('messageId', projectController.messageById);
    app.param('projectId', projectController.projectById);
};
