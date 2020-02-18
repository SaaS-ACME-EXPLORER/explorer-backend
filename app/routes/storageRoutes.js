'use strict';
module.exports = function (app) {
	var storage = require('../controllers/storageController');

	// Data Storage routes
	app.route(BASE_API_PATH + '/storage/insertMany')
		.post(storage.store_json_insertMany);

	app.route(BASE_API_PATH + '/storage/fs')
		.post(storage.store_json_fs);
};