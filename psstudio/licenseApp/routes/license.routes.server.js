/**
 * Created by dushyant on 4/7/16.
 */
var licenseController = require('../../licenseApp/controllers/license.server.controller');

module.exports = function (app)
{
    app.route('/')
        .get(licenseController.licensePortal);

    app.route('/activateOnline')
        .post(licenseController.activateLicenseOnline);
    app.route('/activateOffline')
        .post(licenseController.activateLicenseOffline);
};
