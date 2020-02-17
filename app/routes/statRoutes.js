'use strict';
module.exports = function(app) {
    var dummy = require('../controllers/controller');

    //min max avg or standar deviation per managers
    app.route(BASE_API_PATH + '/stats/byManagers')
    .get(dummy.dummy)


    //min max avg or standar deviation per  application and trips
    app.route(BASE_API_PATH + '/stats/byApplicationTrips')
    .get(dummy.dummy)


    //min max avg or standar deviation per price and trip
    app.route(BASE_API_PATH + '/stats/byPriceTrips')
    .get(dummy.dummy)

    //min max avg or standar deviation per price and trip
    app.route(BASE_API_PATH + '/stats/byApplications')
    .get(dummy.dummy)

}

