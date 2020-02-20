'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

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
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
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
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

ActorSchema.pre('findOneAndUpdate', function (callback) {
  var actor = this;
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});


ActorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('verifying password in actorModel: ' + password);
    if (err) return cb(err);
    console.log('iMatch: ' + isMatch);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Actor', ActorSchema);