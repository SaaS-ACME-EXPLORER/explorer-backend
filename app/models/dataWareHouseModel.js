'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DataWareHouseSchema = new mongoose.Schema({
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  },

  // The average, the minimum, the maximum, and the standard deviation of the number of trips managed per manager.
  minTripsPerManager: [{
    count: { type: Number, min: 0 },
    manager: { type: Schema.Types.ObjectId }
  }],
  maxTripsPerManager: [{
    count: { type: Number, min: 0 },
    manager: { type: Schema.Types.ObjectId }
  }],
  averageTripsPerManager: {
    type: Number,
    min: 0
  },
  standarDeviationTripsPerManager: {
    type: Number,
    min: 0
  },

  // The average, the minimum, the maximum, and the standard deviation of the number of applications per trip.
  minApplicationsPerTrip: [{
    count: { type: Number, min: 0 },
    manager: { type: Schema.Types.ObjectId }
  }],
  maxAplicationsPerTrip: [{
    count: { type: Number, min: 0 },
    manager: { type: Schema.Types.ObjectId }
  }],
  averageApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  standarDeviationApplicationsPerTrip: {
    type: Number,
    min: 0
  },

  // The average, the minimum, the maximum, and the standard deviation of the price of the trips.
  minPricePerTrip: [{
    count: { type: Number, min: 0 },
    manager: { type: Schema.Types.ObjectId }
  }],
  maxPricePerTrip: [{
    count: { type: Number, min: 0 },
    manager: { type: Schema.Types.ObjectId }
  }],
  averagePricePerTrip: {
    type: Number,
    min: 0
  },
  standarDeviationPricePerTrip: {
    type: Number,
    min: 0
  },

  // The ratio of applications grouped by status.
  ratioApplicationsByStatus: {
    type: Number,
    max: 1,
    min: 0
  },

}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
