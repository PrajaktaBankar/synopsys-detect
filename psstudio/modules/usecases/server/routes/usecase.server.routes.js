/**
 * Created by neha on 22/03/2021.
 */

 var usecaseController = require('../controllers/usecase.server.controller');
 var usecasePolicy = require('../policies/usecase.server.policy');
 
 usecasePolicy.invokeRolesPolicies();
 module.exports = function (app) {

    app.route('/api/v2/usecase/report')
    .post(usecaseController.generateReport)

    app.route('/api/v2/usecase').all(usecasePolicy.isAllowed)
    .post(usecaseController.createUsecase)
    .get(usecaseController.getUsecaseList)

    app.route('/api/v2/usecase/:usecaseId').all(usecasePolicy.isAllowed)
    .get(usecaseController.findOneUsecase)
    .put(usecaseController.updateUsecase)
    .delete(usecaseController.deleteUsecase)

    app.param('usecaseId', usecaseController.dataByUsecaseId);
};