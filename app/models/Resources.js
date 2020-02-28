'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResourcesSchema = new Schema({
  name: {
    type: String,
    required: 'Name must be provided',
    unique: true
  },
  value: {
    type: String,
    required: 'Value must be provided'
  },
  description: {
    type: String,
    required: 'Description must be provided'
  }
}, { strict: false });

module.exports = mongoose.model('Resource', ResourcesSchema);