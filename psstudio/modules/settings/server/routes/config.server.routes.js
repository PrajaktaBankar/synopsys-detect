/**
 * Created by saket on 6/10/16.
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../controllers/config.server.controller');
var configPolicy = require('../policies/config.server.policy');

configPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    // Single config routes
    app.route('/api/settings/smtp').all(configPolicy.isAllowed)
        .get(config.readSMTP)
        .put(config.updateSMTP);

    app.route('/api/settings/remote').all(configPolicy.isAllowed)
        .get(config.readRemote)
        .put(config.updateRemote);

    app.route('/api/settings/sms').all(configPolicy.isAllowed)
        .get(config.readSms)
        .put(config.updateSms);

    app.route('/api/settings/zigbee').all(configPolicy.isAllowed)
        .get(config.readZigbee)
        .put(config.updateZigbee);

    app.route('/api/settings/compression').all(configPolicy.isAllowed)
        .get(config.readCompression)
        .put(config.updateCompression);

    app.route('/api/settings/smtp/test').all(configPolicy.isAllowed)
        .put(config.send);

    app.route('/api/settings/purge').all(configPolicy.isAllowed)
        .get(config.readPurgeConfig)
        .put(config.updatePurgeConfig);

    app.route('/api/settings/deviceIdCreation').all(configPolicy.isAllowed)
        .get(config.readDeviceIdConfig)
        .put(config.updateDeviceIdConfig);

    app.route('/api/settings/menu').all(configPolicy.isAllowed)
        .get(config.readMenuConfig)
        .put(config.updateMenuConfig);
};

