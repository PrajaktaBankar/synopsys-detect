/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var schedulerController = require('../controllers/scheduler.server.controller');
var schedulerPolicy = require('../policies/scheduler.server.policy');

schedulerPolicy.invokeRolesPolicies();
module.exports = function (app) {
    // Single config routes
    app.route('/api/v2/scheduler').all(schedulerPolicy.isAllowed)
        .get(schedulerController.list)
        .post(schedulerController.create);

    app.route('/api/v2/scheduler/:schedulerId').all(schedulerPolicy.isAllowed)
        .delete(schedulerController.deleted)
        .get(schedulerController.findOne)
        .put(schedulerController.update)

    app.route('/api/v2/scheduler/:schedulerId/play').all(schedulerPolicy.isAllowed)
        .post(schedulerController.play)

        app.route('/api/v2/scheduler/:schedulerId/pause').all(schedulerPolicy.isAllowed)
        .post(schedulerController.pause)


    app.param('schedulerId', schedulerController.schedulerById)
};

