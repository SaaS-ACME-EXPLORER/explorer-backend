'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  status: {
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
  tripId: {
    type: String,
    required: "Trip ID must be provided"
  },
  explorerId: {
    type: String,
    required: "Explorer ID must be provided"
  },
  comments: [{
    type: String,
  }],
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

ApplicationSchema.pre('save', function (callback) {
  var application = this;
  if (application.status != 'PEDING') {
    application.status = 'PENDING';
  }
  if (application.statusReason && application.statusReason != "") {
    application.statusReason = "";
  }
  if (application.paid) {
    application.paid = false;
  }
  if (application.comments.length != 0) {
    application.comments = [];
  }
  callback();
});

module.exports = mongoose.model('Application', ApplicationSchema);