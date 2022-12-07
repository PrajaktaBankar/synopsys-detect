/**
 * Created by vishnu on 21/03/2018.
 */
'use strict';

/**
 * Module dependencies.
 */
var exportLogsController = require('../../../settings/server/controllers/export-logs.server.controller'),
    exportLogsPolicy = require('../../../settings/server/policies/export-logs.server.policy');

exportLogsPolicy.invokeRolesPolicies();
module.exports = function (app)
{

    app.route('/api/export-logs').all(exportLogsPolicy.isAllowed)
        .post(exportLogsController.exportLogs);

    app.route('/api/export-route-logs').all(exportLogsPolicy.isAllowed)
        .get(exportLogsController.exportRouteAccessLogs);

    app.route('/api/export-pscore-app-logs/:pscoreConfigId').all(exportLogsPolicy.isAllowed)
        .get(exportLogsController.exportPsCoreAppLogs);

    app.route('/api/export-os-logs').all(exportLogsPolicy.isAllowed)
        .post(exportLogsController.exportOSLogs);

    app.route('/api/export-logs/repair').all(exportLogsPolicy.isAllowed)
        .get(exportLogsController.repairLogs);

    app.param('pscoreConfigId',exportLogsController.psCoreConfigById);
};
