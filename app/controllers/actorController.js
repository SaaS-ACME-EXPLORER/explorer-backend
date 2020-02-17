'use strict';
/*---------------ACTOR----------------------*/
const mongoose = require('mongoose');
const actor = require('../models/Actor');

exports.list_all_actors = function (req, res) {
    res.status(200).send("OK");
};

exports.create_an_actor = function (req, res) {
    res.status(200).send("OK");
};

exports.read_an_actor = function (req, res) {
    res.status(200).send("OK");
};

exports.update_an_actor = function (req, res) {
    res.status(200).send("OK");
};

exports.delete_an_actor = function (req, res) {
    res.status(200).send("OK");
};

exports.change_an_actor_status = function (req, res) {
    res.status(200).send("OK");
};