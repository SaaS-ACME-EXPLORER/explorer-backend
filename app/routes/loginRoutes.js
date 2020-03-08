'use strict';
module.exports = function (app) {

    var actors = require('../controllers/actorController');

    app.route(BASE_API_PATH + '/login')
        .post(actors.login_an_actor);
};