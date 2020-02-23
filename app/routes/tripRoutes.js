'use strict';
module.exports = function(app) {

    var trips = require('../controllers/tripController');

    app.route(BASE_API_PATH + '/trips')
        .get(trips.find_all) //list trips or filtered by questystring = keyword
        .post(trips.create_one); //create new trip

    app.route(BASE_API_PATH + '/trips/:trip_id')
        .get(trips.find_one) //get 1 trip
        .put(trips.update_one) //update trip
        .delete(trips.delete_one); //delete trip

    app.route(BASE_API_PATH + '/trips/:trip_id/cancel')
        .put(trips.cancel_a_trip); //cancel trip  (only is able to cancel and not opening) --REASON IS A MUST

};