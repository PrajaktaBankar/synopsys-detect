/**
 * feedback survey schema.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSurveySchema = new Schema({
  surveyType: {
    type: String,
  },
  surveyResponse: {
    type: JSON,
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subscriptionId: {
    type: Schema.ObjectId,
    ref: 'subscription'
  }
});

exports.feedbacksurvey = mongoose.model('feedbacksurvey', FeedbackSurveySchema);
