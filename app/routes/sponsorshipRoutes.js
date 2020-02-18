'use strict';
module.exports = function (app) {
    const Sponsorship = require('../controllers/sponsorshipController')

    app.route(BASE_API_PATH + '/sponsorships')
        .get(Sponsorship.list_all_sponsorships) //list sponsorships or filtered by questystring = actorId
        .post(Sponsorship.create_sponsorship); //create new trip

    app.route(BASE_API_PATH + '/sponsorships/:sponsorship_id')
        .get(Sponsorship.get_a_sponsorship) //get 1 sponsorship
        .put(Sponsorship.update_a_sponsorship); //update sponsorship  

    app.route(BASE_API_PATH + '/sponsorships/:sponsorship_id/pay')
        .put(Sponsorship.pay_a_sponsorship); //pay a sponsorship  

    app.route(BASE_API_PATH + '/sponsorships/:sponsorship_id')
        .delete(Sponsorship.delete_a_sponsorship); //delete sponsorship
};