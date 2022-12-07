'use strict';

var feedbackSurveyPolicy = require('../policies/feedback-survey.server.policy');
feedbackSurveyPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var feedbacksurvey = require('../controllers/feedback-survey.server.controller');

  app
    .route('/api/feedback')
    .all(feedbackSurveyPolicy.isAllowed)
    .post(feedbacksurvey.storeSurveyResponse)
    .get(feedbacksurvey.getSurveyResponse);
};
