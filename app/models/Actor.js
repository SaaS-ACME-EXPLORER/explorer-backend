'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

//FINDER
var FinderSchema = new Schema({
  keyWord: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  minPrice: {
    type: Number,
    min: 0,
    default: null
  },
  maxPrice: {
    type: Number,
    min: 0,
    default: null
  }
}, { strict: false });

//ACTOR
var ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Name must be provided'
  },
  surname: {
    type: String,
    required: 'Surname must be provided'
  },
  email: {
    type: String,
    required: 'Email must be provided',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    minlength: 8,
    required: 'Password must be provided',
  },
  preferredLanguage: {
    type: String,
    default: "en"
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  role: {
    type: String,
    required: 'Role must be provided',
    enum: ['SPONSOR', 'MANAGER', 'ADMINISTRATOR', 'EXPLORER']
  },
  active: {
    type: Boolean,
    default: true
  },
  customToken: {
    type: String
  },
  finder: {
    type: FinderSchema,
    required: function () { return this.role === 'EXPLORER' }
  }
}, { strict: true, timestamps: true});

// Initially, every search criterion must be null.
// Default can't avoid to receive a finder attribute that it is not null, so we force it to do so.
var checkExplorerFinder = function (actor) {
  if (actor.role === 'EXPLORER') {
    if (actor.finder.keyWord) {
      actor.finder.keyWord = null;
    }
    if (actor.finder.startDate) {
      actor.finder.startDate = null;
    }
    if (actor.finder.endDate) {
      actor.finder.endDate = null;
    }
    if(actor.finder.minPrice){
      actor.finder.minPrice = null;
    }
    if(actor.finder.maxPrice){
      actor.finder.minPrice = null;
    }
  }
};

ActorSchema.pre('save', function (callback) {
  var actor = this;
  checkExplorerFinder(actor);
  if (actor.isNew) {
    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
      if (err) return callback(err);

      bcrypt.hash(actor.password, salt, function (err, hash) {
        if (err) return callback(err);
        actor.password = hash;
        callback();
      });
    });
  } else {
    callback();
  }
});

ActorSchema.index({ role: "text"});

module.exports = mongoose.model('Actor', ActorSchema);