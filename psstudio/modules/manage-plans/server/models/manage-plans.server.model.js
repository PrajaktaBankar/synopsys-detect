/**
 * plans schema.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plansSchema = new Schema({
  planType: {
    type: String
  },
  restrictionPlans: {
    type: JSON
  }
});

exports.plans = mongoose.model('plans', plansSchema);
