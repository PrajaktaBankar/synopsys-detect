'use strict';

var templatesPolicy = require('../policies/templates.server.policy');
templatesPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var templates = require('../controllers/templates.server.controller');

  app
    .route('/api/sampletemplates')
    .all(templatesPolicy.isAllowed)
    .post(templates.createTemplate)
    .get(templates.getAllTemplates);

  app
    .route('/api/sampletemplates/:templateId')
    .all(templatesPolicy.isAllowed)
    .put(templates.updateTemplate)
    .delete(templates.deleteTemplate);

  // Finish by binding the user middleware
  app.param('templateId', templates.templateById);
};
