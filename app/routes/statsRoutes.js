'use strict';
module.exports = function(app) {
    var Stats = require('../controllers/statsController');

    //min max avg or standar deviation per managers
    app.route(BASE_API_PATH + '/stats/byManagers')
    .get(Stats.by_managers)


    //min max avg or standar deviation per  application and trips
    app.route(BASE_API_PATH + '/stats/byApplicationTrips')
    .get(Stats.by_application_trips)


    //min max avg or standar deviation per price and trip
    app.route(BASE_API_PATH + '/stats/byPriceTrips')
    .get(Stats.by_price_trips)

    //min max avg or standar deviation per price and trip
    app.route(BASE_API_PATH + '/stats/byApplications')
    .get(Stats.by_applications)

}

