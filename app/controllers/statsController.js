'use strict';
/*---------------TRIP----------------------*/
const Trips = require('../models/Trip');
const Applications = require('../models/Application');

exports.by_managers = (req, res) => {
    Trips.aggregate(
        [
            {
                $group: {
                    _id: { manager: "$managedBy" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    max: { $max: "$count" },
                    min: { $min: "$count" },
                    avg: { $avg: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    max: "$max",
                    min: "$min",
                    avg: "$avg"
                }
            }

        ],
        function (err, result) {
            if (err) {
                res.sensStatus(500);
            } else {
                res.json(result[0]);
            }
        }
    )
};

exports.by_application_trips = (req, res) => {
    Applications.aggregate(
        [
            {
                $group: {
                    _id: { trip: "$tripId" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    max: { $max: "$count" },
                    min: { $min: "$count" },
                    avg: { $avg: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    max: "$max",
                    min: "$min",
                    avg: "$avg"
                }
            }

        ],
        function (err, result) {
            if (err) {
                res.sensStatus(500);
            } else {
                res.json(result[0]);
            }
        }
    )
};

exports.by_price_trips = (req, res) => {
    Trips.aggregate(
        [
            {
                $group: {
                    _id: { trip: "$ticker" },
                    price: { $sum: "$stages.price" }
                }
            },
            {
                $group: {
                    _id: null,
                    max: { $max: "$price" },
                    min: { $min: "$price" },
                    avg: { $avg: "$price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    max: "$max",
                    min: "$min",
                    avg: "$avg"
                }
            }

        ],
        function (err, result) {
            if (err) {
                res.sensStatus(500);
            } else {
                res.json(result[0]);
            }
        }
    )
};

exports.by_applications_status = (req, res) => {
    Applications.aggregate(
        [
            {
                $group: {
                    _id: { status: "$status" },
                    count: { $sum: 1 }
                }
            }
        ],
        function (err, result) {
            if (err) {
                res.sensStatus(500);
            } else {
                res.json(result[0]);
            }
        }
    )
};
