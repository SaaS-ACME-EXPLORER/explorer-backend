'use strict';
const generate = require('nanoid/generate');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const Schema = mongoose.Schema;


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
  date: {
    type: Date,
    required: 'Date and time must be provided'
  }
}, { strict: false });

const TripSchema = new Schema({
  ticker: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: 'Title must be provided'
  },
  description: {
    type: String,
    required: 'Description must be provided'
  },
  // price: {
  //   type: Number,
  //   min: 0,
  //   required: 'Price must be provided',
  // },
  requeriments: {
    type: [String],
    required: 'Requeriments must be provided'
  },
  startDate: {
    type: Date,
    required: 'Start date must be provided'
  },
  endDate: {
    type: Date,
    required: 'End date must be provided'
  },
  cancelled: {
    type: Boolean,
    default: false
  },
  cancelledReason: {
    type: String
  },
  public: {
    type: Boolean,
    default: false
  },
  managedBy: {
    type: String,
    ref: 'Actor',
    required: 'Manager ID must be provided'
  },
  img:
    [{ data: Buffer, contentType: String }]
  ,
  stages: {
    type: [StageSchema],
  }
}, {
  strict: false,
  toJSON: { virtuals: true },
  timestamps: true
});

function stagesMin(val) {
  return val.length > 0;
}

TripSchema.virtual('price').get(function () {
  return this.stages.reduce((a, b) => a + (b.price || 0), 0);
});


TripSchema.index({ startDate: 1, endDate: 1 });
TripSchema.index({ title: 'text', description: 'text', ticker: 'text' });

// Execute before each item.save() call
TripSchema.pre('save', function (callback) {

  var newTrip = this;

  if (!newTrip.ticker) {
    var date = dateFormat(new Date(), "yymmdd");
    var generated_ticker = [date, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-');
    newTrip.ticker = generated_ticker;
  }

  callback();
});


module.exports = mongoose.model('Stage', StageSchema);
module.exports = mongoose.model('Trip', TripSchema);

