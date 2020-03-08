'use strict';
/*---------------ACTOR Auth----------------------*/
var mongoose = require('mongoose');
var Actor = mongoose.model('Actor');
var admin = require('firebase-admin');

exports.getUserId = async function (idToken) {
    console.log('idToken: ' + idToken);
    var id = null;
    try {
        var actorFromFB = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
        return false;
    }

    var uid = actorFromFB.uid;
    var auth_time = actorFromFB.auth_time;
    var exp = actorFromFB.exp;
    console.log('idToken verificado para el uid: ' + uid);
    console.log('auth_time: ' + auth_time);
    console.log('exp: ' + exp);

    var mongoActor = await Actor.findOne({ email: uid });
    if (!mongoActor) {
        console.log("The actor doesn't exists in our DB");
        return false;
    } else {
        console.log('The actor exists in our DB');
        console.log('actor: ' + mongoActor);
        return true;
    }
}