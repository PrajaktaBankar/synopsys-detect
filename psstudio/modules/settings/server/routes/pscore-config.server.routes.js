/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../controllers/pscore-config.server.controller');
var configPolicy = require('../policies/config.server.policy');

configPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    // Single config routes
    app.route('/api/settings/pscoreIdCreation').all(configPolicy.isAllowed)
        .get(config.loadConfigs)
        .post(config.createPscoreId);
    app.route('/api/settings/pscoreIdCreation/:pscoreConfigId').put(config.updateConfig)
    app.route('/api/settings/pscoreIdCreation/:pscoreConfigId').all(configPolicy.isAllowed)
        .get(config.loadConfigs)
        .delete(config.delete);
    app.param('pscoreConfigId',config.psCoreConfigById);
};

