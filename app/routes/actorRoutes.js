'use strict';
module.exports = function (app) {
  var actors = require('../controllers/actorController');

  app.route(BASE_API_PATH + '/actors')
    .get(actors.list_all_actors) //list 
    .post(actors.create_an_actor); //signup

  app.route(BASE_API_PATH + '/actors/:actorId')
    .get(actors.read_an_actor) //get actor information
    .put(actors.update_an_actor) //update personal data 
    .delete(actors.delete_an_actor); //delete an actor

  app.route(BASE_API_PATH + '/actors/:actorId/activate')
    .put(actors.change_an_actor_status); //change activate status to a actor ; ban or unban
};