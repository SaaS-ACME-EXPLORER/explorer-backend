'use strict';
module.exports = function(app) {

    const dummy = require('../controllers/controller');

    app.route(BASE_API_PATH + '/applications')
        .post(dummy.dummy) //create app to a trip; included actorId and ticker
        .get(dummy.dummy); //List all applications

    app.route(BASE_API_PATH + 'applications/:app_id')
        .get(dummy.dummy); //get an apply;
    
    app.route(BASE_API_PATH + '/applications/:app_id/pay')
        .put(dummy.dummy); //pay a trip send amount

    app.route(BASE_API_PATH + '/applications/:app_id/status')
        .put(dummy.dummy); //update state and it is reason if it is cancel or rejected;

};