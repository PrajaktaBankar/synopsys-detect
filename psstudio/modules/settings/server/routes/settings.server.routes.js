/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var settingsController = require('../controllers/settings.server.controller');
var settingsPolicy = require('../policies/settings.server.policy');

settingsPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    // Single config routes
    app.route('/api/settings/general').all(settingsPolicy.isAllowed)
        .get(settingsController.find,settingsController.list)
        .post(settingsController.create);
    app.route('/api/settings/:settingId/general')
        .put(settingsController.updateSettings)
        .delete(settingsController.delete);
    // api to zip the uploaded model by id 
    app.route('/api/v2/model/:taModelId/download')
        .get(settingsController.downloadTaModel).all(settingsPolicy.isAllowed);    
    // api to provide upload model option to the super admin
    app.route('/api/v2/upload/model')
        .get(settingsController.listTaModel)
        .post(settingsController.uploadModelForAnalysis)
        .delete(settingsController.modelById,settingsController.deleteTaModelById).all(settingsPolicy.isAllowed);

    app.param('settingId',settingsController.settingById);
    app.param('taModelId', settingsController.modelById);
};

