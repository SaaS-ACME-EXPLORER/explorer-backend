'use strict';
module.exports = function (app) {
    const Sponsorship = require('../controllers/sponsorshipController')
    const authController = require('../controllers/authController');
    const rolesSponsor = ["SPONSOR"];
    const rolesAdmin = ["ADMINISTRATOR"];
    

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

    app.route(BASE_API_PATH_V2 + '/sponsorships')
        .get(authController.verifyUser(rolesSponsor), Sponsorship.list_all_sponsorships) //list sponsorships or filtered by questystring = actorId
        .post(authController.verifyUser(rolesSponsor),Sponsorship.create_sponsorship); //create new trip

    app.route(BASE_API_PATH_V2 + '/sponsorships/:sponsorship_id')
        .get(authController.verifyUser(rolesSponsor),Sponsorship.get_a_sponsorship) //get 1 sponsorship
        .put(authController.verifyUser(rolesSponsor),Sponsorship.update_a_sponsorship); //update sponsorship  

    app.route(BASE_API_PATH_V2 + '/sponsorships/:sponsorship_id/pay')
        .put(authController.verifyUser(rolesSponsor),Sponsorship.pay_a_sponsorship); //pay a sponsorship  

    app.route(BASE_API_PATH_V2 + '/sponsorships/:sponsorship_id')
        .delete(authController.verifyUser(rolesSponsor),Sponsorship.delete_a_sponsorship); //delete sponsorship

};
