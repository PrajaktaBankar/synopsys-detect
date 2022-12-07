'use strict';

var ordersPolicy = require('../policies/rzp-orders.server.policy');
ordersPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var orders = require('../controllers/rzp-orders.server.controller');

  app.route('/api/orders').all(ordersPolicy.isAllowed).get(orders.getOrders);

  // app.param('subscriptionId', subscription.subscriptionById);
};
