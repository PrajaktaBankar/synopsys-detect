/**
 * Created by vishnu on 03/01/20.
 */

var dataController = require('../controllers/data.server.controller');
var schedulerController = require('../../../settings/server/controllers/scheduler.server.controller');
var dataPolicy = require('../policies/data.server.policy');

dataPolicy.invokeRolesPolicies();
module.exports = function (app) {
    app.route('/api/v2/projects/:projectId/data/:dataId/report').all(dataPolicy.isAllowed)
        .get(dataController.advDataReport)

    app.route('/api/v2/projects/:projectId/data/:dataId/child').all(dataPolicy.isAllowed)
        .get(dataController.getChildDatasets)

    app.route('/api/v2/projects/:projectId/data').all(dataPolicy.isAllowed)
        .get(dataController.list)

    app.route('/api/v2/projects/:projectId/data/fileList').all(dataPolicy.isAllowed)
        .get(dataController.fileList)

    app.route('/api/v2/projects/:projectId/data/fileLists').all(dataPolicy.validateToken, dataPolicy.isAllowed)
        .post(dataController.fileList)

    app.route('/api/v2/projects/:projectId/data/upload/:dataGroupId').all(dataPolicy.validateToken, dataPolicy.isAllowed)
        .post(dataController.getSubscriptionDetails, dataController.uploadData);

    app.route('/api/v2/projects/:projectId/data/querydb').all(dataPolicy.isAllowed)
        .post(dataController.queryDb);

    app.route('/api/v2/projects/:projectId/data/pull').all(dataPolicy.isAllowed)
        .post(dataController.getSubscriptionDetails, schedulerController.findSchedulerById, dataController.pullData);

    app.route('/api/v2/projects/pull/:connectionId').all(dataPolicy.isAllowed)
        .get(dataController.getSubscriptionDetails, dataController.pullSingleData);

    app.route('/api/v2/projects/:projectId/data/pull/done')
        .post(schedulerController.findSchedulerById, dataController.pullDataDone);
    app.route('/api/v2/data/pull/done')
        .put(dataController.updateData);

    app.route('/api/v2/projects/:projectId/data/merge').all(dataPolicy.isAllowed)
        .post(dataController.mergeData);

    app.route('/api/v2/projects/:projectId/data/:dataId').all(dataPolicy.isAllowed)
        .get(dataController.getFileDetails)
        .post(dataController.getPreviewData)
        .delete(dataController.deleteFile)

    app.route('/api/v2/projects/deleteFile').all(dataPolicy.isAllowed)
        .post(dataController.deleteAllFile)

    app.route('/api/v2/dataByFlowId')
        .get(dataController.getDataByFlowId)
    //code for Data Group api 
    app.route('/api/v2/projects/dataGroup').all(dataPolicy.isAllowed)
        .post(dataController.insertDataGroup)
        .put(dataController.updateDataGroup);

    app.route('/api/v2/projects/:projectId/dataGroup').all(dataPolicy.validateToken, dataPolicy.isAllowed)
        .get(dataController.DataGroupList);

    app.route('/api/v2/projects/:projectId/dataGroup/allData').all(dataPolicy.isAllowed)
        .get(dataController.allData)

    app
      .route("/api/v2/projects/:projectId/dataGroup/:dataGroupdataById")
      .all(dataPolicy.isAllowed)
      .delete(
        schedulerController.findSchedulerById,
        dataController.deleteDataGroup
        )
      .post(schedulerController.findSchedulerById, dataController.deleteDataGroupV2) // Used only for migrated (Angular 10) code
      .get(dataController.datagroupfindOne);

    app.route('/api/v2/projects/:projectId/dataConnection/:connectionId').all(dataPolicy.isAllowed)
        .delete(dataController.deleteDataConnection, schedulerController.deleteTask)
        .get(dataController.findOnedataconnection)
        .put(schedulerController.findSchedulerById, dataController.updateDataConnection);


    app.route('/api/v2/projects/:projectId/dataConnections/:source').all(dataPolicy.isAllowed)
        .get(dataController.listAllDataConnections)

    //code for Raw Files api
    app.route('/api/v2/projects/rawFiles').all(dataPolicy.isAllowed)
        .post(dataController.insertRawFiles);

    app.route('/api/v2/projects/:projectId/rawFiles')
        .get(dataController.rawFilesList);

    app.route('/api/v2/projects/:projectId/rawFiles/:rawDataId').all(dataPolicy.isAllowed)
        .delete(dataController.deleteRawFile)
        .post(dataController.getPreviewDataRawFiles)
    app.route('/api/v2/projects/deleteAllRawfiles').all(dataPolicy.isAllowed)
        .post(dataController.deleteAllRawfiles)
    app.route('/api/project/:projectId/udd/execute').all(dataPolicy.isAllowed)
        .get(dataController.executeFlow)

    app.route('/api/project/:projectId/download/:fileName').all(dataPolicy.isAllowed)
        .get(dataController.downloadFile);

    app.param('connectionId', dataController.dataByConnId);
    app.param('dataId', dataController.dataById);
    app.param('dataGroupdataById', dataController.dataGroupdataById);
    app.param('rawDataId', dataController.dataByRawId);
};
