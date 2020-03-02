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
  minTripsPerManager: {
    type: Number,
    min: 0
  },
  maxTripsPerManager: {
    type: Number,
    min: 0
  },
  averageTripsPerManager: {
    type: Number,
    min: 0
  },
  standarDeviationTripsPerManager: {
    type: Number,
    min: 0
  },

  // The average, the minimum, the maximum, and the standard deviation of the number of applications per trip.
  minApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  maxAplicationsPerTrip: {
    type: Number,
    min: 0
  },
  averageApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  standarDeviationApplicationsPerTrip: {
    type: Number,
    min: 0
  },

  // The average, the minimum, the maximum, and the standard deviation of the price of the trips.
  minPricePerTrip: {
    type: Number,
    min: 0
  },
  maxPricePerTrip: {
    type: Number,
    min: 0
  },
  averagePricePerTrip: {
    type: Number,
    min: 0
  },
  standarDeviationPricePerTrip: {
    type: Number,
    min: 0
  },

  // The ratio of applications grouped by status.
  ratioApplicationsByStatus:
    [
      {
        status: { type: String },
        ratio: { type: Number, min: 0, max: 1 }
      }
    ],
  // The average price range that explorers indicate in their finders.
  avgPriceFinders:
  {
    type: Number,
    min: 0
  }

}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
