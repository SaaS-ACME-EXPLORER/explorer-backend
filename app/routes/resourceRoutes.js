'use strict';

var authController = require('../controllers/authController');

module.exports = function (app) {
  var resources = require('../controllers/resourcesController');
  const roles = ["ADMINISTRATOR", "SPONSOR", "MANAGER", "EXPLORER"];

  app.route(BASE_API_PATH + '/resources')
    .get(authController.verifyUser(roles), resources.list_all_resources) //list
    .post(authController.verifyUser(["ADMINISTRATOR"]), resources.create_a_resource) //Create
    .put(authController.verifyUser(["ADMINISTRATOR"]), resources.update_a_resource); //Update

  app.route(BASE_API_PATH + '/resources/:name')
    .get(authController.verifyUser(roles), resources.read_a_resource) //Get one
    .delete(authController.verifyUser(["ADMINISTRATOR"]), resources.delete_a_resource); //Delete
};