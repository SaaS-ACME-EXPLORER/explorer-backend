'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    minlength:8,
    required: 'Password must be provided',
  },
  preferredLanguage:{
    type : String,
    default : "en"
  },
  phone: {
    type: String
  },
  address:{
    type: String
  },
  role: [{
    type: String,
    required: 'Role must be provided',
    enum: ['SPONSOR', 'MANAGER', 'ADMINISTRATOR', 'EXPLORER']
  }],
  active:{
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Actor', ActorSchema);