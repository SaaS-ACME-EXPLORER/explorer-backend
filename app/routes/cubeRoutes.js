'use strict';
module.exports = function (app) {
	var cube = require('../controllers/cubeController');

	app.route(BASE_API_PATH + '/cube')
		.get(cube.get_cube)

};
