'use strict';
module.exports = function (app) {
	var dataWareHouse = require('../controllers/dataWareHouseController');

	app.route('/dataWareHouse')
		.get(dataWareHouse.list_all_indicators)
		.post(dataWareHouse.rebuildPeriod);

	app.route('/dataWareHouse/latest')
		.get(dataWareHouse.last_indicator);

	//min max avg or standar deviation per managers
	app.route(BASE_API_PATH + '/dataWareHouse/byManagers')
		.get(dataWareHouse.by_managers)


	//min max avg or standar deviation per  application and trips
	app.route(BASE_API_PATH + '/dataWareHouse/byApplicationTrips')
		.get(dataWareHouse.by_application_trips)


	//min max avg or standar deviation per price and trip
	app.route(BASE_API_PATH + '/dataWareHouse/byPriceTrips')
		.get(dataWareHouse.by_price_trips)

	//min max avg or standar deviation per price and trip
	app.route(BASE_API_PATH + '/dataWareHouse/byApplications')
		.get(dataWareHouse.by_applications)
};
