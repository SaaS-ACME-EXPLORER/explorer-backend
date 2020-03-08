'use strict';
/*---------------ACTOR----------------------*/

const Resource = require('../models/Resources');
const actorUtils = require('../utils/actorUtils');
var authController = require('./authController');

exports.list_all_resources = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId) {
        Resource.find(function (err, resources) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(resources);
            }
        });
    } else {
        res.sendStatus(401);
    }
};

exports.read_a_resource = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId) {
        Resource.find({ name: req.params.name }, function (err, resource) {
            if (err || resource.length == 0) {
                res.sendStatus(404);
            } else {
                res.json(resource);
            }
        });
    } else {
        res.sendStatus(401);
    }
};

exports.create_a_resource = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId) {
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
    } else {
        res.sendStatus(401);
    }
};

exports.update_a_resource = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId) {
        let actorId = req.body.actorId;
        let updated_resource = req.body.resource;
        if (await actorUtils.getRoleById(actorId) == "ADMINISTRATOR") {

            Resource.findOneAndUpdate({ _id: updated_resource._id }, updated_resource, { new: true }, function (err, resource) {
                if (err) {
                    res.sendStatus(400);
                } else if(resource == undefined){
                    res.sendStatus(404);
                }else {
                    res.json(resource);
                }
            });

        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};

exports.delete_a_resource = async function (req, res) {
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);
    if (authenticatedUserId) {
        let resourceName = req.params.name;
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
    } else {
        res.sendStatus(401);
    }
};