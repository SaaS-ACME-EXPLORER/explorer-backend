'use strict';
/*---------------ACTOR----------------------*/

const Resource = require('../models/Resources');
const actorUtils = require('../utils/actorUtils');

exports.list_all_resources = function (req, res) {
    Resource.find(function (err, resources) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(resources);
        }
    });
};

exports.read_a_resource = function (req, res) {
    let name = req.query.name;
    Resource.find({ name: name }, function (err, resource) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.json(resource);
        }
    });
};

exports.create_a_resource = async function (req, res) {
    let actorId = req.body.actorId;
    let new_resource = new Resource(req.body.resource);
    if (await actorUtils.getRoleById(actorId) == "ADMINISTRATOR") {
        new_resource.save(function (err, resource) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                res.json(resource);
            }
        });
    } else {
        res.sendStatus(403);
    }
};

exports.update_a_resource = async function (req, res) {
    let actorId = req.body.actorId;
    let updated_resource = new Resource(req.body.resource);
    if (await actorUtils.getRoleById(actorId) == "ADMINISTRATOR") {

        Resource.findOneAndUpdate({ _id: updated_resource._id }, updated_resource, function (err, resource) {
            if (err) {
                res.sendStatus(400);
            } else {
                res.json(resource);
            }
        });

    } else {
        res.sendStatus(403);
    }
};

exports.delete_a_resource = async function (req, res) {
    let resourceName = req.query.name;
    let actorId = req.query.actorId;
    if (await actorUtils.getRoleById(actorId) == "ADMINISTRATOR") {
        Resource.deleteOne({ name: resourceName }, function (err, result) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    } else {
        res.sendStatus(403);
    }
};