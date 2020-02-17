'use strict';
module.exports = function(app) {
    var items = require('../controllers/controller');

    app.route(BASE_API_PATH + '/admin/configuration/:finder_id')
    .get(dummy.dummy) //get the conf, 1 per configuration
    .put(dummy.dummy) // set conf


}