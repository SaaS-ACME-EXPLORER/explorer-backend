const Actor = require('../models/Actor');
const mongoose = require('mongoose');


exports.getRoleById = async function getRoleById(actorId) {
    if (!mongoose.Types.ObjectId.isValid(actorId)) {
        return null;
    } else {
        let actor = await Actor.findById(actorId);
        if (actor) {
            return actor.role;
        } else {
            return null;
        }
    }
}

exports.isAdministrator = async function isAdministrator(actorId) {
    if (!mongoose.Types.ObjectId.isValid(actorId)) {
        return false;
    } else {
        let actor = await Actor.findById(actorId);
        if (actor) {
            return "ADMINISTRATOR" == actor.role;
        } else {
            return false;
        }
    }
}

exports.isSponsor = async function isSponsor(actorId) {
    if (!mongoose.Types.ObjectId.isValid(actorId)) {
        return false;
    } else {
        let actor = await Actor.findById(actorId);
        if (actor) {
            return "SPONSOR" == actor.role;
        } else {
            return false;
        }
    }
}

exports.isExplorer = async function isExplorer(actorId) {
    if (!mongoose.Types.ObjectId.isValid(actorId)) {
        return false;
    } else {
        let actor = await Actor.findById(actorId);
        if (actor) {
            return "EXPLORER" == actor.role;
        } else {
            return false;
        }
    }
}

exports.isManager = async function isManager(actorId) {
    if (!mongoose.Types.ObjectId.isValid(actorId)) {
        return false;
    } else {
        let actor = await Actor.findById(actorId);
        if (actor) {
            return "MANAGER" == actor.role;
        } else {
            return false;
        }
    }
}

exports.copyProperties = function copyProperties(source_obj, new_obj) {
    new_obj.name = source_obj.name;
    new_obj.surname = source_obj.surname;
    new_obj.preferredLanguage = source_obj.preferredLanguage;
    new_obj.phone = source_obj.phone;
    new_obj.address = source_obj.address;
    new_obj.role = source_obj.role;
    new_obj.active = source_obj.active;
    new_obj.password = source_obj.password;
    return new_obj;
}


exports.getActorFinder = function (actorId) {
    let isAnExplorer = isExplorer(actorId);
    if (isAnExplorer) {
        Actor.findById(actorId, function (error, actor) {
            if(error){
                return null;
            }else{
                return actor.finder
            }
        });
    } else {
        return null;
    }
}