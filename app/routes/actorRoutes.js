'use strict';

var authController = require('../controllers/authController');

module.exports = function (app) {
  var actors = require('../controllers/actorController');
  const roles = ["ADMINISTRATOR", "SPONSOR", "MANAGER", "EXPLORER"];

  app.route(BASE_API_PATH + '/actors')
    .get(actors.list_all_actors) //list 
    .post(actors.create_an_actor); //signup
    

  app.route(BASE_API_PATH + '/actors/:actorId')
    .get(actors.read_an_actor) //get actor information
    .put(actors.update_an_actor); //update personal data 

  app.route(BASE_API_PATH + '/actors/:actorId/ban')
    .put(actors.change_an_actor_status); //change activate status to a actor ; ban or unban

  app.route(BASE_API_PATH + '/actors/:actorId/password')
    .put(actors.change_password); //change password


    
  app.route(BASE_API_PATH_V2 + '/actors')
    .get(authController.verifyUser(roles), actors.list_all_actors) //list 
    .post(actors.create_an_actor); //signup
    

  app.route(BASE_API_PATH_V2 + '/actors/:actorId')
    .get(authController.verifyUser(roles), actors.read_an_actor) //get actor information
    .put(authController.verifyUser(roles), actors.update_an_actor); //update personal data 

  app.route(BASE_API_PATH_V2 + '/actors/:actorId/ban')
    .put(authController.verifyUser(roles), actors.change_an_actor_status); //change activate status to a actor ; ban or unban

  app.route(BASE_API_PATH_V2 + '/actors/:actorId/password')
    .put(authController.verifyUser(roles), actors.change_password); //change password

};