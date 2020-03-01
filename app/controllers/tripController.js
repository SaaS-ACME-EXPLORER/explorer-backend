'use strict';
/*---------------TRIP----------------------*/

const Trip = require('../models/Trip');
const Application = require('../models/Application');
const Resource = require('../models/Resources');
const logger = require('../utils/logger');
const actorUtils = require('../utils/actorUtils');

//find all
exports.find_all = async function (req, res) {
    try {
        let numperpages = parseInt(req.query['limit']) || 5;
        let page = parseInt(req.query['page']) || 1;
        let numTrips = await Trip.countDocuments();
        let trips = await Trip.find()
            .skip((numperpages * page) - numperpages)
            .limit(numperpages);

        res.send({ trips: trips, totalPages: Math.ceil(numTrips / numperpages) });

    } catch (err) {
        logger.error("ERROR getting trips, Some error occurred while retrieving trips")
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving trips."
        });
    }
}

// find a trip
exports.find_one = async function (req, res) {
    try {
        let trip = await Trip.find({ ticker: req.params.trip_id });

        if (!trip) {
            logger.error(`ERROR: -GET /trip/${req.params.trip_id} - Not found trip with id: ${req.params.trip_id}`);
            return res.status(404).send({
                message: "Trip not found with id " + req.params.trip_id
            });
        }
        res.send(trip);
        return

    } catch (err) {
        logger.error(`ERROR getting trip ${req.params.trip_id}`)
        return res.status(500).send({
            message: "Error retrieving trip with id " + req.params.trip_id
        });
    }
};

// Create a trip only if the logged user is 
exports.create_one = async function (req, res) {
    if (actorUtils.isManager(req.body.actorId)) {
        let trip = new Trip(req.body.trip)
        try {
            trip.managedBy = req.body.actorId;

            if (trip.endDate < trip.startDate) {
                res.status(400);
                res.json({ message: "Trip end date should be after start date" });
                return
            }

            if (trip.cancelled) {
                if (req.body.cancelledReason) {
                    trip.cancelledReason = req.body.cancelledReason ? req.body.cancelledReason : trip.cancelledReason;
                } else {
                    res.status(400);
                    res.json({ message: "Trip cancellation is required" });
                    return
                }
            }

            let response = await trip.save();
            res.status(201);
            res.json(response);
        } catch (error) {
            if (error) {
                res.status(500);
                res.json({ message: error.message });
            }
        }
    } else {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
    }
};

exports.update_one = async function (req, res) {
    if (actorUtils.isManager(req.body.actorId)) {
        try {

            let trip = await Trip.findOne({ ticker: req.params.trip_id });

            if (!trip) {
                res.status(404);
                res.json({ message: "Trip Not Found" });
                return
            } else if (trip.managedBy != req.body.actorId) {
                res.status(403);
                res.json({ message: "403 Forbidden request" });
                return
            } else if (trip.public) {
                res.status(403);
                res.json({ message: "Trip already published" });
                return
            } else {
                //   ticker and managedBy not editable
                trip.title = req.body.title ? req.body.title : trip.title;
                trip.description = req.body.description ? req.body.description : trip.description;
                trip.price = req.body.price ? req.body.price : trip.price;
                trip.requeriments = req.body.requeriments ? req.body.requeriments : trip.requeriments;
                trip.startDate = req.body.startDate ? req.body.startDate : trip.startDate;
                trip.endDate = req.body.endDate ? req.body.endDate : trip.endDate;
                trip.stages = req.body.stages ? req.body.stages : trip.stages;
                trip.cancelled = req.body.cancelled ? req.body.cancelled : trip.cancelled;
                if (trip.cancelled) {
                    trip.cancelled = req.body.cancelled ? req.body.cancelled : trip.cancelled;
                    if (req.body.cancelledReason) {
                        trip.cancelledReason = req.body.cancelledReason ? req.body.cancelledReason : trip.cancelledReason;
                    } else {
                        res.status(400);
                        res.json({ message: "Trip cancellation error is required" });
                        return
                    }
                }
                trip.public = req.body.public ? req.body.public : trip.public;
                trip.img = req.body.img ? req.body.img : trip.img;

                if (trip.endDate < trip.startDate) {
                    res.status(400);
                    res.json({ message: "Trip end date should be after start date" });
                    return
                }

                let response = await trip.save();
                res.status(200);
                res.json(response);
                return
            }

        } catch (error) {
            logger.error(error);
            res.status(500);
            res.json({ message: "Internal Error" });
            return
        }
    } else {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
    }
};

exports.delete_one = async function (req, res) {
    if (actorUtils.isManager(req.body.actorId)) {

        try {
            let trip = await Trip.findOne({ ticker: req.params.trip_id })

            if (!trip) {
                res.status(404);
                res.json({ message: "Trip Not Found" });
                return
            } else if (trip.managedBy != req.body.actorId) {
                res.status(403);
                res.json({ message: "403 Forbidden request" });
                return
            } else if (trip.public) {
                res.status(403);
                res.json({ message: "Trip already published" });
                return
            } else {
                Trip.deleteOne({ ticker: req.params.trip_id }, function (err, trip) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        res.status(204);
                        res.json({ message: 'Trip successfully deleted' });
                    }
                });
            }
        } catch (error) {
            logger.error(error);
            res.status(500);
            res.json({ message: "Internal Error" });
            return
        }
    } else {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
    }
};
// Cancel a trip that has been published but has not yet started and does not have any accepted applications
exports.cancel_a_trip = async function (req, res) {
    if (actorUtils.isManager(req.body.actorId)) {
        try {

            let trip = await Trip.findOne({ ticker: req.params.trip_id });
            let applications = await Application.find({ tripId: req.params.trip_id, status: 'ACCEPTED' });
            if (!trip) {
                res.status(404);
                res.json({ message: "Trip Not Found" });
                return
            } else if (trip.managedBy != req.body.actorId) {
                res.status(403);
                res.json({ message: "403 Forbidden request" });
                return
            } else if (trip.startDate < Date.now()) {
                res.status(403);
                res.json({ message: "Trip already stared" });
                return
            } else if (applications) {
                res.status(403);
                res.json({ message: "Trip already has accepted Aplications" });
                return
            } else {
                trip.cancelled = true;

                if (req.body.cancelledReason) {
                    trip.cancelledReason = req.body.cancelledReason;
                } else {
                    res.status(400);
                    res.json({ message: "Trip cancellation error is required" });
                    return
                }

                let response = await trip.save();
                res.status(200);
                res.json(response);
                return
            }

        } catch (error) {
            logger.error(error);
            res.status(500);
            res.json({ message: "Internal Error" });
            return
        }
    } else {
        res.status(403);
        res.json({ message: "403 Forbidden request" });
    }
};


//Find the trips that meet the search criteria (finder)
//params: ?actorId=123abc&&
exports.finder_find_all = async function (req, res) {
    const actorId = req.query.actorId;
    let finder = actorUtils.getActorFinder(actorId);
    if (finder) {
        let limit = await getFinderResultsLimit();
        let aggregate = buildAggregate(finder, limit);
        if (aggregate) {
            return Trip.aggregate(aggregate);
        } else {
            // In case all finder criterias are null
            return Trip.find().limit(limit);
        }
    } else {
        logger.error("The actor must be an explorer");
        res.status(403).json({ "error": "The actor must be an explorer" });
    }
}

//Get the results limit that match the finder criterias (default: 10, max: 100)
var getFinderResultsLimit = async function () {

    await Resource.findOne({ name: 'FinderResultLimit' }, function (error, resource) {
        if (error || !resource) {
            logger.error("Error when searching a resource with name: FinderResultLimit");
            return 10;
        } else {
            if (!isNaN(resource.value)) {
                try {
                    let val = parseInt(resource.value);
                    let limit = (val > 0 && val <= 100) ? val : 10;
                    return limit;
                } catch (error) {
                    logger.error("Unexpected error (possibly parsing resource.value)")
                    return 10;
                }
            } else {
                logger.error("FinderResultLimit resource is not a number");
                return 10;
            }
        }
    });

};

var buildAggregate = function (finder, limit) {
    let aggregate = [];
    if (finder.keyWord || startDate || endDate || price) {
        let match = {};
        match.$match = {};
        if (finder.keyWord) {
            match.$match.$text = { $search: finder.keyWord, $caseSensitive: false, $diacriticSensitive: false };
        }
        if (startDate) {
            match.$match.startDate = { $gte: finder.startDate };
        }
        if (endDate) {
            match.$match.endDate = { $lte: finder.endDate };
        }
        if (price) {
            match.$match.price = { $gte: finder.minPrice, $lte: finder.maxPrice };
        }
        aggregate.push(match);
        aggregate.push({ $sort: { startDate: -1 } });
        aggregate.push({ $limit: limit });
        return aggregate;
    }
    return null;
};




// return Trip.aggregate([
//     {
//         $match: {
//             $text: {
//                 $search: finder.keyWord,
//                 $caseSensitive: false,
//                 $diacriticSensitive: false
//             },
//             startDate: { $gte: finder.startDate },
//             endDate: { $lte: finder.endDate },
//             price: { $gte: finder.minPrice, $lte: finder.maxPrice }
//         }
//     },
//     {
//         $sort: { startDate: -1 }
//     }
// ]);