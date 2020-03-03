'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderCacheSchema = new Schema({
  actorId: {
    type: Schema.Types.ObjectId,
    ref: 'Actor',
    required: 'Actor ID must be provided'
  },
  results: [{
    ticker: { type: String },
    title: { type: String },
    price: { type: String }
  }]

}, { strict: false, timestamps: true });

module.exports = mongoose.model('FinderCache', FinderCacheSchema);