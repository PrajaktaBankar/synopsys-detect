'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');
const config = require('../../../../config/config');
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 3,
  handler: (req, res, next) => {
    return res.status(429).send({
      message: 'Too many requests, please try again after some time',
    });
  },
});

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var adminPolicy = require('../policies/admin.server.policy');
  if (config.app.useCaptcha) {
    app
      .route('/api/auth/signin')
      .post(apiLimiter, users.validateCaptcha, users.validatePlanExpiry, users.signin);
    // Register user route (without recaptcha) - only used for SaaS version
    app.route('/api/auth/register').post(users.validateCaptcha, users.isEmailExist, users.register);
  } else {
    app.route('/api/auth/signin').post(apiLimiter, users.validatePlanExpiry, users.signin);
    // Register user route (with recaptcha) - only used for SaaS version
    app.route('/api/auth/register').post(users.isEmailExist, users.register);
  }

  // Setting up the users password api
  app.route('/api/auth/forgot').post(users.forgot);
  app.route('/api/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/auth/reset/:token').post(users.reset);
  app.route('/api/auth/rba').post(users.changePasswordByAdmin);
  // Used for SaaS version
  app.route('/api/auth/resetpassword').post(users.changePasswordForSaas).get(users.validateOTP);

  app.route('/api/auth/verification').post(users.resendVerificationLink);
  app.route('/api/auth/signup').post(adminPolicy.isAllowed, users.signup);

  app.route('/api/auth/signout').get(users.signout);
  app.route('/api/auth/validateUser').post(users.validateUser);
  // Setting the facebook oauth routes
  app.route('/api/auth/facebook').get(
    users.oauthCall('facebook', {
      scope: ['email'],
    })
  );
  app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));

  // Setting the twitter oauth routes
  app.route('/api/auth/twitter').get(users.oauthCall('twitter'));
  app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));

  // Setting the google oauth routes
  app.route('/api/auth/google').get(
    users.oauthCall('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    })
  );
  app.route('/api/auth/google/callback').get(users.oauthCallback('google'));

  // Setting the linkedin oauth routes
  app.route('/api/auth/linkedin').get(
    users.oauthCall('linkedin', {
      scope: ['r_basicprofile', 'r_emailaddress'],
    })
  );
  app.route('/api/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

  // Setting the github oauth routes
  app.route('/api/auth/github').get(users.oauthCall('github'));
  app.route('/api/auth/github/callback').get(users.oauthCallback('github'));

  // Setting the paypal oauth routes
  app.route('/api/auth/paypal').get(users.oauthCall('paypal'));
  app.route('/api/auth/paypal/callback').get(users.oauthCallback('paypal'));
};
