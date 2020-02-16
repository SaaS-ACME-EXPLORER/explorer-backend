'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  sponsorId: {
    type: Number,
    required: 'Sponsor ID must be provided'
  },
  ticker: {
    type: String,
    required: "Ticker's Trip must be provided"
  },
  amount: {
    type: Number,
    required: 'Amount must be provided'
  },
  link: {
    type: String,
    required: 'Link must be provided'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Sponsorship', SponsorshipSchema);