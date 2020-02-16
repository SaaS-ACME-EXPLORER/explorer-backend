'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  sponsorId: {
    type: Number,
    required: 'Sponsor ID must be provided'
  },
  tripId: {
    type: Number,
    required: 'Trip ID must be provided'
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
  banner: {
    data: Buffer,
    contentType: String,
    required: 'Banner must be provided'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Sponsorship', SponsorshipSchema);