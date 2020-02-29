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
    required: 'Link must be provided',
    match: [/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/, 'Please fill a valid link']
  }
}, { strict: true, timestamps: true });


SponsorshipSchema.index({ sponsorId: 1, tripId: 1});
SponsorshipSchema.index({ sponsorId: 1});

module.exports = mongoose.model('Sponsorship', SponsorshipSchema);