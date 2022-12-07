'use strict';

var subscriptionPolicy = require('../policies/subscription.server.policy');
subscriptionPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var subscription = require('../controllers/subscription.server.controller');

  app
    .route('/api/user/subscription')
    .all(subscriptionPolicy.isAllowed)
    .post(subscription.handleSubscription);

  app
    .route('/api/user/:userId/subscription/:subscriptionId')
    .all(subscriptionPolicy.isAllowed)
    .get(subscription.getSubscriptionDetails)
    .post(subscription.upgradePlan);

  app
    .route('/api/subscription/cancel')
    .all(subscriptionPolicy.isAllowed)
    .post(subscription.cancelSubscription);

    app
    .route('/api/user/:userId/restriction')
    .all(subscriptionPolicy.isAllowed)
    .get(subscription.getRestrictionDetails);

  app.route('/api/razorpay/verify').post(subscription.verifyRzpPayment);

  app.param('subscriptionId', subscription.subscriptionById);
};
