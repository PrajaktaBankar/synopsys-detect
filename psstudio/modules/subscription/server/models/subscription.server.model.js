/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
  planType: {
    type: String,
  },
  planDuration: {
    type: String,
  },
  status: {
    type: String,
  },
  planStart: {
    type: Date,
    default: Date.now,
  },
  planEnd: {
    type: Date,
  },
  isFreeTrial: {
    type: Boolean,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  upcomingPlan: {
    type: String,
  },
  // upcomingPlans: [
  //   {
  //     type: String,
  //   },
  // ],
  // upcomingPlans: {
  //   type: [String],
  //   default: [],
  // },
  // upcomingPlans: [String],
  rzpSubId: {
    type: String,
  },
  rzpCustId: {
    type: String,
  },
  rzpPlanId: {
    type: String,
  },
  rzpEventId: {
    type: String,
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

exports.subscription = mongoose.model('subscription', SubscriptionSchema);
