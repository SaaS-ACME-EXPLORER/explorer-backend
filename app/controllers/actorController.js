'use strict';
/*---------------ACTOR----------------------*/

const Actor = require('../models/Actor');
const actorUtils = require('../utils/actorUtils');

exports.list_all_actors = async function (req, res) {

    if (req.query.actorId) {
        var actorId = req.query.actorId;
        var role = await actorUtils.getRoleById(actorId);

        let numperpages = parseInt(req.query['limit']) || 5;
        let page = parseInt(req.query['page']) || 1;

        var query;

        if (role == undefined) {
            res.status(404);
        } else {

            if (role == "EXPLORER" || role == "SPONSOR") {
                res.sendStatus(401);
            } else if (role == "MANAGER") {
                query = [{ 'role': "EXPLORER" }, { 'role': "SPONSOR" }];
            } else if (role == "ADMINISTRATOR") {
                query = [{ 'role': "EXPLORER" }, { 'role': "SPONSOR" }, { 'role': "MANAGER" }];
            } else {
                res.sendStatus(400);
            }

            if (query != undefined) {

                let numActors = await Actor.count({ $or: query });

                let actors = await Actor.find({ $or: query })
                    .skip((numperpages * page) - numperpages)
                    .limit(numperpages);

                res.send({ actors: actors, totalPages: Math.ceil(numActors / numperpages) });
            }
        }

    } else {
        res.sendStatus(400);
    }
};

exports.create_an_actor = async function (req, res) {
    var new_actor = new Actor(req.body.actor);
    var roleCreator = await actorUtils.getRoleById(req.body.actorCreator);
    var authorized = true;

    if (new_actor.role != undefined) {

        if (roleCreator == undefined && new_actor.role != "EXPLORER") {
            authorized = false;
        } else if (roleCreator == "MANAGER" && (new_actor.role != "SPONSOR" || new_actor.role != "EXPLORER")) {
            authorized = false;
        } else if (roleCreator == "ADMINISTRATOR" && new_actor.role == "ADMINISTRATOR") {
            authorized = false;
        } else if (roleCreator == "SPONSOR") {
            authorized = false;
        }

        if (authorized) {
            new_actor.save(function (err, actor) {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.json(actor);
                }
            });
        } else {
            res.sendStatus(401);
        }

    } else {
        res.status(400);
        res.json({ message: "Role is empty" });
    }
};

exports.read_an_actor = async function (req, res) {
    var roleFinder = await actorUtils.getRoleById(req.query.actorFinder);

    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.status(404).send(err);
        } else {

            var authorized = false;

            if (roleFinder == "MANAGER" && (actor.role == "SPONSOR" || actor.role == "EXPLORER")) {
                authorized = true;
            } else if (roleFinder == "ADMINISTRATOR" && actor.role != "ADMINISTRATOR") {
                authorized = true;
            }

            if (authorized) {
                res.json(actor);
            } else {
                res.sendStatus(401);
            }
        }
    });
};

exports.update_an_actor = function (req, res) {

    var updatedActor = req.body.updatedActor;

    var authorized = req.body.actorUpdater == updatedActor.id_;

    if (authorized) {
        Actor.findByIdAndUpdate(updatedActor.id_, updatedActor, function (err, actor) {
            if (err) {
                res.status(404).send(err);
            } else {
                res.json(actor);
            }
        });
    } else {
        res.sendStatus(401);
    }
};

exports.change_an_actor_status = async function (req, res) {

    var roleBanner = await actorUtils.getRoleById(req.query.adminId);
    var banned = req.query.adminId;
    var actorId = req.query.actorId;

    if (req.query.active != undefined) {
        statusActor = req.query.active;

        Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "active": statusActor } }, { new: true }, function (err, actor) {
            if (err) {
                res.status(404).send(err);
            }
            else {
                res.json(actor);
            }
        });

    } else {
        res.status(400).send(err);
    }
};