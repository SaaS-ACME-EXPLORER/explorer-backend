'use strict';
module.exports = function (app) {
  var actors = require('../controllers/actorController');

  app.route(BASE_API_PATH + '/actors')
    .get(actors.list_all_actors) //list 
    .post(actors.create_an_actor) //signup
    .put(actors.update_an_actor); //update personal data 

  app.route(BASE_API_PATH + '/actors/:actorId')
    .get(actors.read_an_actor); //get actor information

  app.route(BASE_API_PATH + '/actors/ban')
    .put(actors.change_an_actor_status); //change activate status to a actor ; ban or unban

  app.route(BASE_API_PATH + '/actors/password')
    .put(actors.change_password); //change password
};