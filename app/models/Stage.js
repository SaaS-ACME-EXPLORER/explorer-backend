'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StageSchema = new Schema({
  title: {
    type: String,
    required: "Title must be provided"
  },
  description: {
    type: String,
    required: 'Description must be provided'
  },
  price: {
    type: Number,
    required: 'Price must be provided'
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Stage', StageSchema);