'use strict';

var managePlansPolicy = require('../policies/manage-plans.server.policy');
managePlansPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var managePlansController = require('../controllers/manage-plans.server.controller');

  app
    .route('/api/v2/manage/plans/')
    .all(managePlansPolicy.isAllowed)
    .get(managePlansController.getPlansData)
    .post(managePlansController.addNewRule)
    .put(managePlansController.updateAndSaveRule);
};
