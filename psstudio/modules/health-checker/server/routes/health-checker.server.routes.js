'use strict';

module.exports = function (app) {
  var healthChecker = require('../controllers/health-checker.server.controller');

  app.route('/api/fetch').get(healthChecker.validateLicense);
};
