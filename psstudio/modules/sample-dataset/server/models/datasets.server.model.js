/**
 * Created by vishnu on 29/11/17.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DatasetSchema = new Schema({
  name: {
    type: String,
  },
  domain: {
    type: String,
  },
  description: {
    type: String,
  },
  file: {
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

mongoose.model('dataset', DatasetSchema);
