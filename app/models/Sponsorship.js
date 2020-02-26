'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  sponsorId: {
    type: String,
    required: true
  },
  tripId: {
    type: String,
    required: true
  },
  paid: {
    type: Boolean,
    required: 'Paid must be provided',
    default: false
  },
  link: {
    type: String,
    required: 'Link must be provided'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: true });

module.exports = mongoose.model('Sponsorship', SponsorshipSchema);