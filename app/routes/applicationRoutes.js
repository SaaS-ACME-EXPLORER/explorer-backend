'use strict';
module.exports = function(app) {

    const applications = require('../controllers/applicationsController');

    app.route(BASE_API_PATH + '/applications')
        .post(applications.create_an_application) //create app to a trip; included actorId and ticker
        .get(applications.list_all_applications); //List all applications

    app.route(BASE_API_PATH + '/applications/:app_id')
        .get(applications.read_an_application); //get an apply;
    
    app.route(BASE_API_PATH + '/applications/:app_id/pay')
        .put(applications.pay_an_application); //pay a trip send amount

    app.route(BASE_API_PATH + '/applications/:app_id/status')
        .put(applications.change_an_application_status); //update state and its reason if it is cancel or rejected;

};