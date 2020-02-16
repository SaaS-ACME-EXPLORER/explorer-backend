'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TripSchema = new Schema({
  ticker: {
    type: String,
    required: 'Ticker must be provided'
  },
  title: {
    type: String,
    required: 'Title must be provided'
  },
  description: {
    type: String,
    required: 'Description must be provided'  
  },
  price: {
    type: Number,
    required: 'Price must be provided',
  },
  requeriments:{
    type : [String],
    required: 'Requeriments must be provided'
  },
  starts: {
    type: Date,
    required: 'Start date must be provided'
  },
  ends:{
    type: Date,
    required: 'End date must be provided'
  },
  cancelled:{
    type: Boolean,
    default: false
  },
  statusReason: [{
    type: String
  }],
  public:{
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  managedBy: {
    type: String,
    required: 'Manager ID must be provided'
  }
}, { strict: false });

module.exports = mongoose.model('Trip', TripSchema);

//FALTAN LAS IMAGENES