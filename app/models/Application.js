'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  statusName: {
    type: String,
    default: 'PENDING',
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']
  },
  statusReason: {
    type: String,
  },
  paid: {
    type: Boolean,
    default: false
  },
  ticker: {
    type: String,
    required: "Trip's Ticker ID must be provided"
  },
  explorerId: {
    type: String,
    required: "Explorer ID must be provided"
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Application', ApplicationSchema);