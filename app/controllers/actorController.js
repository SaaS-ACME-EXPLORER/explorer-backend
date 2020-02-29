'use strict';
/*---------------ACTOR----------------------*/

const Actor = require('../models/Actor');
const actorUtils = require('../utils/actorUtils');
var bcrypt = require('bcrypt');

exports.list_all_actors = async function (req, res) {

    if (req.query.actorId) {
        let actorId = req.query.actorId;
        let role = await actorUtils.getRoleById(actorId);

        let numperpages = parseInt(req.query['limit']) || 5;
        let page = parseInt(req.query['page']) || 1;

        let query;

        if (role == undefined) {
            res.status(404);
        } else {

            if (role == "EXPLORER" || role == "SPONSOR") {
                res.sendStatus(403);
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
    let new_actor = new Actor(req.body.actor);
    let roleCreator = await actorUtils.getRoleById(new_actor.actorId);
    let authorized = true;

    if (typeof new_actor.role !== undefined) {

        if (typeof roleCreator === undefined && new_actor.role != "EXPLORER") {
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
            res.sendStatus(403);
        }

    } else {
        res.status(400);
        res.json({ message: "Role is empty" });
    }
};

exports.read_an_actor = async function (req, res) {
    let actorUpdater = await actorUtils.getRoleById(req.query.actorId);
    let actorToUpdate = req.params.actorId;
    Actor.findById(actorToUpdate, function (err, actor) {
        if (err) {
            res.status(404).send(err);
        } else {

            let authorized = false;

            if (actorUpdater == "MANAGER" && (actor.role == "SPONSOR" || actor.role == "EXPLORER")) {
                authorized = true;
            } else if (actorUpdater == "ADMINISTRATOR" && actor.role != "ADMINISTRATOR") {
                authorized = true;
            }

            if (authorized) {
                res.status(200).send(actor);
            } else {
                res.sendStatus(403);
            }
        }
    });
};

exports.update_an_actor = function (req, res) {

    const updatedActor = req.body.updatedActor;
    const updatedActorId = req.params.actorId;
    const actorId = req.body.actorId; 

    if(!updatedActor || !actorId || !updatedActorId){
        logger.error("Invalid updatedActor, actorId or updatedActorId");
        res.status(400).json({"error": "Invalid updatedActor, actorId or updatedActorId"});
        return;
    }
    
    let authorized = actorId == updatedActorId;

    if (authorized) {
        Actor.findByIdAndUpdate(updatedActorId, updatedActor, { new: true }, function (err, actor) {
            if (err) {
                res.status(404).send(err);
            } else {
                res.status(200).send(actor);
            }
        });
    } else {
        res.sendStatus(403);
    }
};

exports.change_an_actor_status = async function (req, res) {

    let roleBanner = await actorUtils.getRoleById(req.body.adminId);
    let active = req.body.active;
    let actorId = req.params.actorId;

    if (roleBanner === "ADMINISTRATOR") {
        if (typeof active == undefined || active == null) {
            res.sendStatus(400);
        } else {
            Actor.findById(actorId, function (err, actor) {
                if (err) {
                    res.sendStatus(404);
                } else {
                    if (actor.role == "ADMINISTRATOR") {
                        res.sendStatus(403);
                    } else {
                        actor.active = active;
                        actor.save(function (err, actor) {
                            if (err) {
                                res.sendStatus(500).send(err);
                            } else {
                                res.status(200).send(actor);
                            }
                        });
                    }
                }
            });
        }
    } else {
        res.sendStatus(403);
    }
};


exports.change_password = async function (req, res) {
    let actorId = req.params.actorId;
    let oldPass = req.body.oldPass;
    let newPass = req.body.newPass;

    if (actorId == undefined || oldPass == undefined || newPass == undefined) {
        res.sendStatus(400);
    } else {
        Actor.findById(actorId, function (err, actor) {
            if (err) {
                res.sendStatus(404);
            } else {
                bcrypt.compare(oldPass, actor.password, function (err, isMatch) {
                    if (isMatch) {
                        bcrypt.genSalt(5, function (err, salt) {
                            if (err) return callback(err);

                            bcrypt.hash(newPass, salt, function (err, hash) {
                                if (err) return callback(err);
                                actor.password = hash;
                                Actor.updateOne({ _id: actor._id }, actor, function (err, actor) {
                                    res.sendStatus(200);
                                });
                            });
                        });
                    } else {
                        res.sendStatus(403);
                    }
                });
            }
        })
    }

};