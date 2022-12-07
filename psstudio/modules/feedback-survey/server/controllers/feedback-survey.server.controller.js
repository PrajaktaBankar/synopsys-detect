var path = require('path'),
  logger = require(path.resolve('./logger'));

const mongoose = require('mongoose');
const FeedbackSurvey = mongoose.model('feedbacksurvey');
var date = Date(Date.now());
date = date.toString();
exports.storeSurveyResponse = (surveyResponse) => {
  var feedbackSurvey = new FeedbackSurvey(surveyResponse.body);
  feedbackSurvey.save(function (err) {
    if (err) {
      logger.error("Saving survey response failed. ", { error: err, Date: date });
    } else {
      return true;
    }
  });
};

exports.getSurveyResponse = (req, res) => {
  FeedbackSurvey.find().sort({ createdAt: -1 }).exec(function (err, surveyRes) {
    if (err) {
      logger.error('Feedback can not get response', { Date: date })
      return res.status(400).send(err.message);
    }
    res.send(surveyRes);
  });
}