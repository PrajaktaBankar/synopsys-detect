'use strict';

var plansPolicy = require('../policies/rzp-plans.server.policy');
plansPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var plans = require('../controllers/rzp-plans.server.controller');

  app.route('/api/plans').all(plansPolicy.isAllowed).get(plans.getAllPlans);

  // app.param('subscriptionId', subscription.subscriptionById);
};
