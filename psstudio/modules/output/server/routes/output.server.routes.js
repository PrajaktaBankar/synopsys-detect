/**
 * Created by vishnu on 03/01/20.
 */

var outputController = require('../controllers/output.server.controller');
var outputPolicy = require('../policies/output.server.policy');

outputPolicy.invokeRolesPolicies();
module.exports = function (app) {

    app.route('/api/v2/projects/:projectId/output').all(outputPolicy.isAllowed)
        .post(outputController.insertReportOutputData)
        .get(outputController.reportOutputList)

    app.route('/api/v2/projects/:projectId/output/:outputId').all(outputPolicy.isAllowed)
        .delete(outputController.deleteReport)

    //share
    app.route('/api/v2/projects/:projectId/shareOutput').all(outputPolicy.isAllowed)
        .post(outputController.reportShare)


    //share list
    app.route('/api/v2/projects/:projectId/shareOutput/list').all(outputPolicy.isAllowed)
        .post(outputController.shareOutputList)


    app.route('/api/v2/projects/:projectId/shareOutput/:shareOutputId').all(outputPolicy.isAllowed)
        .delete(outputController.deleteShareOutput)
        .get(outputController.shareDataByOutputId)


    app.route('/api/v2/projects/shareOutput/byUser').all(outputPolicy.validateToken, outputPolicy.isAllowed)
        .get(outputController.reportOutputListByUser)

    app.route('/api/v2/projects/:projectId/output/data/reportpreview').all(outputPolicy.isAllowed)
        .post(outputController.viewShareReport)

    app.route('/api/v2/projects/output/data').all(outputPolicy.validateToken, outputPolicy.isAllowed, outputPolicy.checkCount)
        .post(outputController.viewShareReportByID)

    app.route('/api/v2/projects/:projectId/output/:outputId/preview').all(outputPolicy.isAllowed)
        .post(outputController.getPreviewFiles)

    app.param('outputId', outputController.dataByOutputId);
    app.param('shareOutputId', outputController.shareDataByOutputId);

};