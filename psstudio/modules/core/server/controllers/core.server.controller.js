'use strict';
const config = require('../../../../config/config');
const lic = require('../../../../licenseApp/utils/core.license.util.js');
const licApp = require('../../../../licenseApp/controllers/license.server.controller');
var coreSystemUtil = require('../../../../utils/system/core.system.utils.js');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  lic.isValid(function (valid) {
    if (!valid) {
      licApp.licensePortal(req, res);
      coreSystemUtil.restartService();
    } else {
      // Set's the CSRF token to the client's browser cookies
      res.cookie('XSRF-TOKEN', req.csrfToken(), { sameSite: 'strict' });
      if (config.app.type === 'saas') {
        res.render('public/ng-ui/saas', {
          user: req.user || null,
          recaptchaNonce: config.app.recaptchaNonce,
        });
      } else {
        res.render('public/ng-ui/enterprise', {
          user: req.user || null,
          recaptchaNonce: config.app.recaptchaNonce,
        });
      }
    }
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...',
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {
  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl,
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found',
      });
    },
    default: function () {
      res.send('Path not found');
    },
  });
};
