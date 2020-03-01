'use strict';
module.exports = function (app) {
    var stats = require('../controllers/statsController');

    app.route(BASE_API_PATH + '/stats/tripsPerManager')
        .get(stats.by_managers);

    app.route(BASE_API_PATH + '/stats/applicationPerTrip')
        .get(stats.by_application_trips);

    app.route(BASE_API_PATH + '/stats/tripPrice')
        .get(stats.by_price_trips);

    app.route(BASE_API_PATH + '/stats/statusApplications')
        .get(stats.by_applications_status);
};