'use strict';
/*---------------ACTOR----------------------*/

const Actor = require('../models/Actor');

exports.list_all_actors = function (req, res) {
    //Check if the role param exist
    
    if (req.query.role) {
        var query = {};
        query.role = req.query.role;
    }

    //Adapt to find the actors with the specified role
    Actor.find(query, function (err, actors) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.json(actors);
        }
    });
};

exports.create_an_actor = function (req, res) {
    var new_actor = new Actor(req.body);

    new_actor.save(function (err, actor) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.json(actor);
        }
    });
};

exports.read_an_actor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.status(404).send(err);
        }
        else {
            res.json(actor);
        }
    });
};

exports.update_an_actor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.status(404).send(err);
        } else {
            var actor_updated = copyProperties(new Actor(req.body), actor);
            actor_updated.save(function(err, saved){
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(saved);
                }
            });
        }
    });
};

exports.delete_an_actor = function (req, res) {
    Actor.deleteOne({ _id: req.params.actorId }, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json({ message: 'Actor successfully deleted' });
        }
    });
};

exports.change_an_actor_status = function (req, res) {
    var statusActor;
    if (req.query.active != undefined) {
        statusActor = req.query.active;

        Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "active": statusActor } }, { new: true }, function (err, actor) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.json(actor);
            }
        });

    } else {
        res.status(400).send(err);
    }
};

let copyProperties = function copyProperties(source_obj, new_obj){
    new_obj.name = source_obj.name;
    new_obj.surname = source_obj.surname;
    //new_obj.email = source_obj.email;
    new_obj.preferredLanguage = source_obj.preferredLanguage;
    new_obj.phone = source_obj.phone;
    new_obj.address = source_obj.address;
    new_obj.role = source_obj.role;
    new_obj.active = source_obj.active;
    new_obj.password = source_obj.password;
    return new_obj;
}