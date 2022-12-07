/**
 * Created by vishnu on 22/11/18.
 */

'use strict';

/**
 * Module dependencies.
 */
var udd = require('../controllers/udd.server.controller'),
    uddPolicy = require('../policies/udd.server.policy'),
    projectController = require('../../../projects/server/controllers/projects.server.controller'),
    auditLog = require('../../../auditlogs/server/controllers/auditlog.server.controller');
var schedulerController = require('../../../settings/server/controllers/scheduler.server.controller')
uddPolicy.invokeRolesPolicies();
module.exports = function (app) {

    app.route('/api/udd').all(uddPolicy.validateToken, uddPolicy.isAllowed)
        .get(udd.list)
        .post(schedulerController.findSchedulerById, udd.create);

    app.route('/api/udd/:uddId').all(uddPolicy.validateToken, uddPolicy.isAllowed)
        .get(udd.read)
        .put(udd.update)
        .delete(udd.delete, schedulerController.deleteTask);

    app.route('/api/project/:projectId/udd/:uddId/execute').all(uddPolicy.validateToken, uddPolicy.isAllowed)
        .get(udd.startUddFlow)
    
    app.route('/api/node-red/errorLog/:uddId').all(uddPolicy.validateToken, uddPolicy.isAllowed)
        .get(auditLog.readLog)
        .delete(auditLog.deleteLog)
    // Finish by binding the Udd Flow middleware
    app.param('uddId', udd.uddByID);
    app.param('projectId', projectController.projectById)

};
