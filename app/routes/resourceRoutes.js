'use strict';
module.exports = function (app) {
  var resources = require('../controllers/resourcesController');

  app.route(BASE_API_PATH + '/resources')
    .get(resources.list_all_resources) //list
    .post(resources.create_a_resource) //Create
    .put(resources.update_a_resource); //Update

  app.route(BASE_API_PATH + '/resources/:name')
    .get(resources.read_a_resource) //Get one
    .delete(resources.delete_a_resource); //Delete
};