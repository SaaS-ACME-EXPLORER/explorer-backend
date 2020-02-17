'use strict';
module.exports = function (app) {
    const dummy = require('../controllers/controller')

    app.route(BASE_API_PATH + '/sponsorships')
        .get(dummy.dummy) //list sponsorships or filtered by questystring = actorId
        .post(dummy.dummy); //create new trip

    app.route(BASE_API_PATH + '/sponsorships/:sponsorship_id')
        .get(dummy.dummy) //get 1 sponsorship
        .put(dummy.dummy); //update sponsorship  

    app.route(BASE_API_PATH + '/sponsorships/:sponsorship_id/pay')
        .put(dummy.dummy); //pay a sponsorship  

    app.route(BASE_API_PATH + '/sponsorships/:sponsorship_id')
        .delete(dummy.dummy); //delete sponsorship
};