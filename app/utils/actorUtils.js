const Actor = require('../models/Actor');

exports.getRoleById = async function getRoleById(actorId) {

    let actor = await Actor.findById(actorId);
    return actor.role;
}

exports.isAdministrator = async function isAdministrator(actorId) {

    let actor = await Actor.findById(actorId);
    return "ADMINISTRATOR" == actor.role;
}

exports.isSponsor= async function isSponsor(actorId) {

    let actor = await Actor.findById(actorId);
    return "SPONSOR" == actor.role;
}

exports.isExplorer = async function isExplorer(actorId) {

    let actor = await Actor.findById(actorId);
    return "EXPLORER" == actor.role;
}

exports.isManager = async function isManager(actorId) {

    let actor = await Actor.findById(actorId);
    return "MANAGER" == actor.role;
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