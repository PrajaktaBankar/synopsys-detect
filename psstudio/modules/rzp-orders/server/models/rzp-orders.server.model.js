/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
  rzpPayId: {
    type: String,
  },
  rzpPayStatus: {
    type: String,
  },
  rzpOrderId: {
    type: String,
  },
  rzpPayMethod: {
    type: String,
  },
  rzpInvoiceId: {
    type: String,
  },
  rzpOfferId: {
    type: String,
  },
  rzpPlanId: {
    type: String,
  },
  subId: {
    type: Schema.ObjectId,
    ref: 'subscription',
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

exports.order = mongoose.model('order', OrderSchema);
