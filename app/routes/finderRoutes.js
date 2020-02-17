'use strict';
module.exports = function (app) {
    const dummy = require('../controllers/controller');

    app.route(BASE_API_PATH + '/finders/:finder_id')
        .get(dummy.dummy) //get finder; querystring finder_id(ONLY for explorer, validated)
        .put(dummy.dummy);  //update a finder; (ONLY for explorers)

    app.route(BASE_API_PATH + '/finders')
        .post(dummy.dummy); //create a new finder; (ONLY for explorers)  

    app.route(BASE_API_PATH + '/finders/average')
        .get(dummy.dummy); //get average price; querystring actor_id(ONLY for explorer, validated)

    app.route(BASE_API_PATH + '/finders/keys')
        .get(dummy.dummy); //get top10 key words; querystring actor_id(ONLY for explorer, validated)
};