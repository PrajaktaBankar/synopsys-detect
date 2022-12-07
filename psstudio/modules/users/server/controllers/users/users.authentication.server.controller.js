'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve(
    './modules/core/server/controllers/errors.server.controller'
  )),
  mongoose = require('mongoose'),
  passport = require('passport'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Plans = mongoose.model('plans'),
  Subscription = mongoose.model('subscription'),
  Order = mongoose.model('order'),
  request = require('request'),
  Apiaccess = mongoose.model('Apiaccess');
var jwt = require('jsonwebtoken');
const { recaptchaSecretKey, recaptcha } = require('../../../../../config/env/test');
const hideAndSeek = require('../../../../../utils/crypt/hideandseek');
const sendMail = require('../../../../../utils/general/email.utils.server');
const basicPlan = require('../../../../../config/env/plans/basic-subscription');
const proPlan = require('../../../../../config/env/plans/pro-subscription');
//const
var date = Date(Date.now());
date = date.toString();

// URLs for which user can't be redirected on signin
var noReturnUrls = ['/authentication/signin', '/authentication/signup'];

async function checkUserLimit(user, callback) {
  let limit = 0,
    query;

  if (config.app.type === 'saas') {
    /**
     * Get the user subscription details and based on the subscription assign the limits
     */
    const subscription = await Subscription.findById(user.subscription);
    let data = null;
    subscription && Plans.findOne({planType: subscription.planType}, function (err, planTemplateData) {
      if (err){
        logger.error('Can not add new Plan to the plans collection', { Date: date })
        return res.status(400).send(err.message);
      }
      data = planTemplateData.restrictionPlans.find(val => val.moduleName === 'user');
      data.rules.find( item => {
        if(item.name === 'numberofinvitationsallowed'){
          limit = item.allowedValues;
        }
      });
    });
    // if (subscription && subscription.planType === 'basic') {
    //   limit = basicPlan.user.maxInvitations;
    // } else {
    //   limit = proPlan.user.maxInvitations;
    // }
    // return callback(true);
    /**
     * For SaaS version super admin can add many users, we keep limit as -1 so it will be unlimited.
     */
    if (user.roles.includes('super_admin')) {
      limit = -1;
    }
    query = { createdBy: user._id };
  } else {
    if (!config.license.userLimit) {
      return callback(true);
    }
    limit = config.license.userLimit;
    query = {};
  }

  User.countDocuments(query).exec(function (err, count) {
    if (err) {
      logger.error('Unable to get count of users', { error: err, Date: date });
      return callback(false);
    } else {
      if (limit === -1) {
        return callback(false);
      } else {
        logger.info(`Count:${count}-limit:${limit}`, { Data: date });
        return callback(count >= limit);
      }
    }
  });
}

/**
 * Validates is email exists in DB or not while registration
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.isEmailExist = async (req, res, next) => {
  try {
    let user = req.body;
    if (user.email) {
      const docs = await User.find({ email: user.email });
      if (docs.length) {
        logger.error('Email already exists -' + user.email, { Date: date });
        return res.status(400).send({ message: 'Email already exists.' });
      } else {
        next();
      }
    } else {
      logger.error('Invalid email -' + user.email, { Date: date });
      return res.status(400).send({ message: 'Invalid email' });
    }
  } catch (err) {
    logger.error('Email validation failed', { Date: date });
    return res.status(400).send({ message: 'Email validation failed' });
  }
};

/**
 * Validates the recaptcha while registration
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.validateCaptcha = async (req, res, next) => {
  let token = req.body.captchaToken;
  const url = `${config.recaptcha.validationUrl}secret=${config.recaptcha.secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`;
  if (!token) {
    logger.error('Captcha token empty', { Date: date });
    return res.status(400).send({ message: 'Captcha token invalid.' });
  }
  request(url, function (err, response, body) {
    body = JSON.parse(body);
    if (err) {
      logger.error('Captcha validation not working', { Date: date });
      return res.status(400).send({ message: 'Captcha validation not working.' });
    }
    if (body.success !== undefined && !body.success) {
      logger.error('Captcha validation failed', { Date: date });
      return res.status(400).send({ message: 'Captcha validation failed.' });
    } else {
      logger.info('Captcha validation successful', { Date: date });
      next();
    }
  });
};

/**
 * Registers the user (Only for free trial/SaaS version)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.register = async (req, res, next) => {
  try {
    let metaData = {};
    req.body.roles = [config.app.roles.S_ADMIN];
    var user = new User(req.body);
    user.provider = 'local';
    user.displayName = `${user.firstName} ${user.lastName}`;
    user.isFreeTrialUsed = false;
    var httpTransport = 'http://';
    if (config.secure && config.secure.ssl === true) {
      httpTransport = 'https://';
    }
    let url = httpTransport + req.headers.host + '/banner';
    let otp = generateOTP();
    otp = hideAndSeek.encryption(otp);
    let username = hideAndSeek.encryption(user.username);
    user.validationOtp = otp;
    const userData = await user.save();
    if (userData) {
      userData.password = undefined;
      userData.salt = undefined;
      req.user = userData;
      metaData.type = 'welcome';
      metaData.user = userData;
      metaData.url = `${url}?id=${username}&otp=${otp}`;
      let emailOpt = {
        subject: `Welcome To PredictSense!`,
        to: userData.email,
      };
      sendMail.mailHandler(emailOpt, metaData);
      res.send(userData);
    } else {
      return res.status(400).send({ message: 'Unable to register the user.' });
    }
  } catch (err) {
    logger.error('User registration failed -' + err);
    return err.code === 11000
      ? res.status(400).send({ message: 'Username already exists.' })
      : res.status(400).send({ message: 'User registration failed.' });
  }
};

/**
 * Resend the verification link to the user
 * @param {*} req
 * @param {*} res
 */
exports.resendVerificationLink = async (req, res) => {
  try {
    let metaData = {};
    let emailOpt;
    let body = req.body;
    let httpTransport = 'http://';
    if (config.secure && config.secure.ssl === true) {
      httpTransport = 'https://';
    }
    let url = httpTransport + req.headers.host + '/banner';
    let otp = generateOTP();
    otp = hideAndSeek.encryption(otp);
    let username = hideAndSeek.encryption(body.username);
    let userData = await User.findOneAndUpdate({ username: body.username }, { validationOtp: otp });
    if (userData.createdBy) {
      const emailBody = `<h2 style="text-transform: capitalize;">Hello ${userData.username},</h2><p>Please click <a href="${url}?id=${username}&otp=${otp}">here</a> to verify your account.</p><p>Warm Regards,<br />The PredictSense Support Team</p>`;
      emailOpt = {
        to: userData.email,
        subject: 'PredictSense - Verification Link',
        html: emailBody,
      };
      metaData.type = 'general';
      metaData.emailBody = emailBody;
    } else {
      metaData.type = 'welcome';
      metaData.user = userData;
      metaData.url = `${url}?id=${username}&otp=${otp}`;
      emailOpt = {
        subject: 'PredictSense - Verification Link',
        to: userData.email,
      };
    }
    sendMail.mailHandler(emailOpt, metaData);
    res.send({ message: 'Verification link sent' });
  } catch (err) {
    logger.error('Unable to send verification link -' + err), { Date: date };
    res.status(500).send({ message: err });
  }
};

// /**
//  * function to generate the otp.
//  * @param {*} req
//  * @param {*} res
//  * @returns
//  */
function generateOTP() {
  // Declare a string variable
  // which stores all string
  let otpGenrateSting = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OTP = '';

  // Find the length of string
  var len = otpGenrateSting.length;
  for (let i = 0; i < 6; i++) {
    OTP += otpGenrateSting[Math.floor(Math.random() * len)];
  }
  return OTP;
}

exports.validateUser = async function (req, res) {
  try {
    let username = hideAndSeek.decryption(req.body.username);
    let validate = hideAndSeek.decryption(req.body.otp);
    const user = await User.findOne({
      username: username,
    });
    let otp = hideAndSeek.decryption(user.validationOtp);
    if (otp == validate) {
      var update = {
        isVerified: true,
      };
      User.updateOne(
        { _id: user._id },
        {
          $set: update,
        },
        function (err, affected, resp) {
          if (err) {
            logger.error('user verification failed' + user._id, { Date: date });
            return res.status(400).send({
              message: 'user verification failed',
            });
          }
          res.send({ message: 'Your account is verified' });
        }
      );
    } else {
      res.status(400).send({
        message: 'Invalid user',
      });
    }
  } catch (err) {
    logger.error('Unable to verify account -' + err), { Date: date };
    return res.status(500).send({ message: err });
  }
};

/**
 * Validates whether users plan is expired or free trail ended
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.validatePlanExpiry = async (req, res, next) => {
  try {
    let subDoc, orderDoc;
    const userDoc = await User.findOne({ username: req.body.username }).lean();
    if (userDoc) {
      let createdBy = userDoc._id;
      /**
       * userDoc['createdBy'] - this field will exist only for SaaS version and for an invited user
       */
      if (userDoc['createdBy'] && userDoc.roles.includes(config.app.roles.S_DEV)) {
        createdBy = userDoc['createdBy'];
      }
      subDoc = await Subscription.findOne({ createdBy: createdBy });
    } else {
      return res.status(400).send({ message: 'No user found with the provided username' });
    }
    if (subDoc) {
      delete userDoc.password;
      delete userDoc.salt;
      req.isFreeTrial = subDoc.isFreeTrial;
      req.isCancelled = subDoc.isCancelled;
      req.status = subDoc.status;
      // Check for totally fresh new user
      subDoc.status === 'created' && !subDoc.rzpPlanId && !subDoc.rzpSubId
        ? (req.hasFreeTrialUsed = false)
        : (req.hasFreeTrialUsed = true);
      req.rzpPlanId = subDoc.status === 'created' && !subDoc.isFreeTrial ? null : subDoc.rzpPlanId;
      orderDoc = await Order.find({ subId: subDoc._id });
      const rzpPaymentDone = orderDoc ? orderDoc.find((e) => e.rzpPayStatus !== 'captured') : [];
      req.paymentCaptured = !rzpPaymentDone || rzpPaymentDone.length >= 1 ? false : true;
      // Check if users plan has expired and update the DB
      if (new Date(subDoc.planEnd) < new Date() && subDoc.status === 'active') {
        req.isFreeTrial = false;
        req.status = 'inactive';
        await Subscription.findOneAndUpdate(
          { _id: subDoc._id, status: 'active' },
          { status: 'inactive', isFreeTrial: false, updatedAt: Date.now() }
        );
      }
      next();
    } else {
      // Check for user is super admin
      if (userDoc.roles[0] === 'super_admin') {
        next();
      } else {
        // Check for user haven't subscribed to any plans or free trial
        req.status = 'inactive';
        req.isFreeTrial = false;
        req.hasFreeTrialUsed = false;
        req.isCancelled = false;
        req.paymentCaptured = false;
        next();
      }
    }
  } catch (err) {
    logger.error('Plan expiry checking failed -' + err, { Date: date });
    return res.status(400).send({ message: 'Plan expiry checking failed' });
  }
};

/**
 * Signup
 */
exports.signup = function (req, res, next) {
  checkUserLimit(req.user, function (limitReached) {
    // For security measurement we remove the roles from the req.body object
    if (limitReached) {
      return res.status(400).send({ message: 'User limit reached for your current plan' });
    } else {
      var finalData = {};
      if (config.app.type !== 'enterprise') {
        //This is used for SaaS user invitation only
        //If the user is added by super_admin, set role to admin
        if (req.user.roles.includes('super_admin')) {
          req.body.roles = ['admin'];
        } else if (req.user.roles.includes('admin')) {
          req.body.roles = ['developer'];
        } else {
          req.body.roles = [config.app.roles.S_DEV];
        }
        req.body['createdBy'] = req.user._id;
        req.body['subscription'] = req.user.subscription;
      }
      req.body.isEnabled = req.body.isEnabled !== null ? req.body.isEnabled : 'true';
      var user = new User(req.body);
      // Add missing user fields
      user.provider = 'local';
      user.displayName = user.firstName + ' ' + user.lastName;
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      let url = httpTransport + req.headers.host + '/banner';
      let otp = generateOTP();
      otp = hideAndSeek.encryption(otp);
      let username = hideAndSeek.encryption(user.username);
      user.validationOtp = otp;
      // Then save the user
      user.save(function (err, userData) {
        if (err) {
          if (err.keyValue.username) {
            return res.status(400).send({
              message: 'Username already exists',
            });
          } else if (err.keyValue.email) {
            return res.status(400).send({
              message: 'Email already exists',
            });
          } else {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err),
            });
          }
        } else {
          if (req.body.data) {
            finalData.user_id = user._id;
            finalData.apis = req.body.data;
            var apiaccess = new Apiaccess(finalData);
            apiaccess.save(function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
              }
            });
          }
          if (config.app.type !== 'enterprise' && !req.user.roles.includes('super_admin')) {
            let metaData = {};
            metaData.type = 'invite';
            metaData.decryptedPwd = req.body.password;
            metaData.user = userData;
            metaData.url = `${url}?id=${username}&otp=${otp}`;
            metaData.inviter = req.user.displayName;
            let emailOpt = {
              subject: `${req.user.displayName} invited you to join the PredictSense`,
              to: userData.email,
            };
            sendMail.mailHandler(emailOpt, metaData);
          }
          // Remove sensitive data before login
          userData.password = undefined;
          userData.salt = undefined;
          res.json(userData);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      var userData = {};
      var word = req.headers.referer;
      var urlWord = word ? word.substr(word.lastIndexOf('/') + -4) : null;
      var today = new Date();
      var userValidity = new Date(user.validity);
      if(user.roles.includes('super_admin') || today <= userValidity || !user.validity){
        if (urlWord == 'docs/') {
          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else if (
              user.isVerified == false &&
              (user.roles[0] == 's_admin' || user.roles[0] == 's_developer')
            ) {
              res.status(400).send({
                message:
                  'Account not verified. Check your registered email or resend verification link',
                isVerified: user.isVerified,
              });
            } else if (!user.isEnabled) {
              res.status(400).send({
                message:
                  'User account disabled',
                isEnabled: user.isEnabled,
              });
            } else {
              var token = jwt.sign(
                {
                  data: user,
                },
                'M%Z8XJQv,&Mh4#SF',
                {
                  expiresIn: 20 * 60,
                }
              );
              userData._id = user._id;
              userData.firstName = user.firstName;
              userData.lastName = user.lastName;
              userData.email = user.email;
              userData.profileImageURL = user.profileImageURL;
              userData.roles = user.roles;
              userData.created = user.created;
              userData.displayName = user.displayName;
              userData.provider = user.provider;
              userData.username = user.username;
              userData.token = token;
              userData = JSON.parse(JSON.stringify(userData));
              // Added extra keys to validate users
              userData.status = req.status;
              userData.isFreeTrial = req.isFreeTrial;
              userData.hasFreeTrialUsed = req.hasFreeTrialUsed;
              userData.rzpPlanId = req.rzpPlanId;
              userData.isCancelled = req.isCancelled;
              userData.isVerified = user.isVerified;
              userData.paymentCaptured = req.paymentCaptured;
              res.send(userData);
            }
          });
        } else {
          user.password = undefined;
          user.salt = undefined;
          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else if (
              user.isVerified == false &&
              (user.roles[0] == 's_admin' || user.roles[0] == 's_developer')
            ) {
              res.status(400).send({
                message:
                  'Account not verified. Check your registered email or resend verification link',
                isVerified: user.isVerified,
              });
            } else if (!user.isEnabled) {
              res.status(400).send({
                message:
                  'User account disabled',
                isEnabled: user.isEnabled,
              });
            } else {
              user = JSON.parse(JSON.stringify(user));
              // Adds two extra keys to validate users
              user.status = req.status;
              user.isFreeTrial = req.isFreeTrial;
              user.hasFreeTrialUsed = req.hasFreeTrialUsed;
              user.rzpPlanId = req.rzpPlanId;
              user.isCancelled = req.isCancelled;
              user.isVerified = user.isVerified;
              user.paymentCaptured = req.paymentCaptured;
              res.json(user);
            }
          });
        }
      } else {
        res.status(400).send({
          message:
            'User account expired',
          isVerified: user.isVerified,
        });
      }
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = async (req, res) => {
  const userSessions = await mongoose.connection.db.collection('sessions').find();
  userSessions.forEach(async (item) => {
    if (item._id === req.sessionID) {
      await mongoose.connection.db.collection('sessions').findOneAndDelete({ _id: req.sessionID });
    }
  });
  // logout() is the passport.js method, which removes the req.user property and clear the login session
  req.logout();
  res.redirect('/login');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect(
          '/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err))
        );
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField =
      'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField =
      'additionalProvidersData.' +
      providerUserProfile.provider +
      '.' +
      providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] =
      providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] =
      providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery],
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername =
            providerUserProfile.username ||
            (providerUserProfile.email ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData,
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (
      user.provider !== providerUserProfile.provider &&
      (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])
    ) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated',
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err),
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
