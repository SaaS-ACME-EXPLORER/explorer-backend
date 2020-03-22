'use strict';
module.exports = function (app) {
    var authController = require('../controllers/authController');
    var trips = require('../controllers/tripController');
    const roles = ["ADMINISTRATOR", "SPONSOR", "MANAGER", "EXPLORER"];


    app.route(BASE_API_PATH + '/trips')
        .get(trips.find_all) //list trips or filtered by questystring = keyword
        .post(trips.create_one); //create new trip

    app.route(BASE_API_PATH + '/trips/:trip_id')
        .get(trips.find_one) //get 1 trip
        .put(trips.update_one) //update trip
        .delete(trips.delete_one); //delete trip

    app.route(BASE_API_PATH + '/trips/:trip_id/cancel')
        .put(trips.cancel_a_trip); //cancel trip  (only is able to cancel and not opening) --REASON IS A MUST

    app.route(BASE_API_PATH + '/trips/finder')
        .get(trips.finder_find_all);


    // v2
    app.route(BASE_API_PATH_V2 + '/trips')
        .get(authController.verifyUser(roles), trips.find_all) //list trips or filtered by questystring = keyword
        .post(authController.verifyUser(roles), trips.create_one); //create new trip

    app.route(BASE_API_PATH_V2 + '/trips/:trip_id')
        .get(authController.verifyUser(roles), trips.find_one) //get 1 trip
        .put(authController.verifyUser(roles), trips.update_one) //update trip
        .delete(authController.verifyUser(roles), trips.delete_one); //delete trip

    app.route(BASE_API_PATH_V2 + '/trips/:trip_id/cancel')
        .put(authController.verifyUser(roles), trips.cancel_a_trip); //cancel trip  (only is able to cancel and not opening) --REASON IS A MUST

    app.route(BASE_API_PATH_V2 + '/trips/finder')
        .get(authController.verifyUser(roles), trips.finder_find_all);

};