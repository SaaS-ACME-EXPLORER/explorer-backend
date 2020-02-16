'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderSchema = new Schema({
  actorId: {
    type: String,
    required: "Actor ID must be provided"
  },
  keyWord: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  minPrice: {
    type: Number,
    min: 0
  },
  maxPrice: {
    type: Number,
    min: 0
  }
}, { strict: false });

module.exports = mongoose.model('Resource', FinderSchema);

//FALTAN LAS IMAGENES