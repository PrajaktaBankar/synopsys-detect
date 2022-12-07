'use strict';

var supportPolicy = require('../policies/support.server.policy');
supportPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var support = require('../controllers/support.server.controller');

  app
    .route('/api/support/ticket')
    .all(supportPolicy.isAllowed)
    .post(support.generateTicket)
    .get(support.getTickets);

  app.route('/api/support/ticket/:ticketId').all(supportPolicy.isAllowed).put(support.updateTicket);

  // Finish by binding the user middleware
  app.param('ticketId', support.ticketById);
};
