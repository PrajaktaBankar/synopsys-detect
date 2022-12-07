'use strict';

module.exports = function (app) {
  var webhooks = require('../controllers/rzp-webhooks.server.controller');

  // Catches all the razorpay webhook events
  app.route('/api/razorpay/webhooks').post(webhooks.handleWebhookEvents);
};
