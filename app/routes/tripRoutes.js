'use strict';
module.exports = function(app) {

    const dummy = require('../controllers/controller');

    app.route(BASE_API_PATH + '/trips')
        .get(dummy.dummy) //list trips or filtered by questystring = keyword
        .post(dummy.dummy); //create new trip

    app.route(BASE_API_PATH + '/trips/:trip_id')
        .get(dummy.dummy) //get 1 trip
        .put(dummy.dummy) //update trip
        .delete(dummy.dummy); //delete trip

    app.route(BASE_API_PATH + '/trips/:trip_id/cancel')
        .put(dummy.dummy); //cancel trip  (only is able to cancel and not opening) --REASON IS A MUST

};