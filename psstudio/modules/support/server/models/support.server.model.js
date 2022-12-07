/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TicketSchema = new Schema({
  subject: {
    type: String,
  },
  comment: {
    type: String,
  },
  topic: {
    type: String,
  },
  status: {
    type: String,
  },
  solution: {
    type: String,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
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

mongoose.model('ticket', TicketSchema);
