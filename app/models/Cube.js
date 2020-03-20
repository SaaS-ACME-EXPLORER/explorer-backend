'use strict';
var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var Cube = new Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  tripId: {
    type: String,
    required: true
  },
  explorerId: {
    type: String,
    required: true
  },
  month: {
    type: Number
  },
  year: {
    type: Number
  },
  amount: {
    type: Number
  }
}, { strict: true, timestamps: false });


// SponsorshipSchema.index({ sponsorId: 1, tripId: 1});
// SponsorshipSchema.index({ sponsorId: 1});
Cube.plugin(uniqueValidator);
module.exports = mongoose.model('Cube', Cube);