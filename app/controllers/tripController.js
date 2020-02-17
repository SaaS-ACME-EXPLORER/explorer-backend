'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trip');

exports.list_all_trips = function(req, res) {
    res.status(200).send("OK");
};

exports.create_a_trip = function(req, res) {
    res.status(200).send("OK");
};

exports.read_a_trip = function(req, res) {
    res.status(200).send("OK");
};

exports.update_a_trip = function(req, res) {
    res.status(200).send("OK");
};

exports.delete_a_trip = function(req, res) {
    res.status(200).send("OK");
};

exports.cancel_a_trip = function(req, res) {
    res.status(200).send("OK");
};