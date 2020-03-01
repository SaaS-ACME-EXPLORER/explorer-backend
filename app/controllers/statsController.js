'use strict';
/*---------------TRIP----------------------*/
const Trips = require('../models/Trip');
//const Trip = require('../models/Trip');

// The average, the minimum, the maximum, and the standard deviation of the number of trips managed per manager
exports.by_managers = (req, res) => {
    let bymanagers = Trips.aggregate([
        { $group: { _id: { managedBy: "$managedBy" }, contador: { $sum: 1 } } },
        {
            $facet: {
                max: [{ $sort: { contador: -1 } }],
                min: [{ $sort: { contador: 1 } }],
                average: {$avg:  { contador }
            }
        },
        {
            $project: {
                max: { $arrayElemAt: ["$max", 0] },
                min: { $arrayElemAt: ["$min", 0] }
            }
        }
    ], function (err, res) {
        console.log(res[0])
    });
    console.log(bymanagers);
    res.status(200).send("OK");
};

exports.by_application_trips = (req, res) => {
    res.status(200).send("OK");
};

exports.by_price_trips = (req, res) => {
    res.status(200).send("OK");
};

exports.by_applications = (req, res) => {
    res.status(200).send("OK");
};
