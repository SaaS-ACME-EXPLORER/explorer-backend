'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
    Actor = mongoose.model('Actor');

exports.list_all_actors = function (req, res) {
    //Check if the role param exist
    var roleName;
    if (req.query.role) {
        roleName = req.query.role;
    }
    //Adapt to find the actors with the specified role
    Actor.find({ role: roleName }, function (err, actors) {
        if (err) {
            res.status(500).send(err);
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
            res.status(500).send(err);
        }
        else {
            res.json(actor);
        }
    });
};

exports.read_an_actor = function (req, res) {
    Actor.findById(req.params.actorId, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(actor);
        }
    });
};

exports.update_an_actor = function (req, res) {
    Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(actor);
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
        res.status(402).send(err);
    }


};