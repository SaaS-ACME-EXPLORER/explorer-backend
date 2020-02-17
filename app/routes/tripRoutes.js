'use strict';
module.exports = function(app) {

    var trips = require('../controllers/tripController');

    app.route(BASE_API_PATH + '/trips')
        .get(trips.list_all_trips) //list trips or filtered by questystring = keyword
        .post(trips.create_a_trip); //create new trip

    app.route(BASE_API_PATH + '/trips/:trip_id')
        .get(trips.read_a_trip) //get 1 trip
        .put(trips.update_a_trip) //update trip
        .delete(trips.delete_a_trip); //delete trip

    app.route(BASE_API_PATH + '/trips/:trip_id/cancel')
        .put(trips.cancel_a_trip); //cancel trip  (only is able to cancel and not opening) --REASON IS A MUST

};