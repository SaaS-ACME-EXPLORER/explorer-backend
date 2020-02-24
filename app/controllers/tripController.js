'use strict';
/*---------------TRIP----------------------*/

const Trip = require('../models/Trip');
const logger = require('../utils/logger');

//find all
exports.find_all = async function (req, res) {
    try {
        let numperpages = parseInt(req.query['limit']) || 5;
        let page = parseInt(req.query['page']) || 1;
        let numTrips = await Trip.count();
        let trips = await Trip.find()
            .skip((numperpages * page) - numperpages)
            .limit(numperpages);

        res.send({ trips: trips, totalPages: Math.ceil(numTrips / numperpages) });

    } catch (err) {
        logger.error("ERROR getting trips, Some error occurred while retrieving trips")
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving trips."
        });
    };
};

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

exports.create_one = async function (req, res) {
    let trip = new Trip(req.body)
    try {
        let response = await trip.save();
        res.status(201);
        res.json(response);
    } catch (error) {
        if (error) {
            res.status(400);
            res.json({ message: error.message });
        
        }
        // if (error.errors.name.kind == "required") {
        //     res.status(400);
        //     res.json({ message: "Bad Request" });
        // } else if (error.errors.name.kind == "unique") {
        //     res.status(409);
        //     res.json({ message: "Conflict" });
        // } else {
        //     logger.error(error);
        //     res.status(500);
        //     res.json({ message: "Internal Error" });
        // }
    }
};


exports.update_one = async function (req, res) {
    // if (!checkBody(req.body)) {
    //     res.status(400);
    //     res.json({ message: "Bad Request" });
    //     return
    // }
    try {

        let trip = await Trip.findOneAndUpdate({ ticker: req.params.trip_id }, req.body, {
            new: true
        });

        if (!trip) {
            res.status(404);
            res.json({ message: "Trip Not Found" });
            return
        } else {
            res.status(200);
            res.json(trip);
            return
        }

    } catch (error) {
        logger.error(error);
        res.status(500);
        res.json({ message: "Internal Error" });
        return

    }
};

exports.delete_one = function (req, res) {
    try {

        Trip.deleteOne({ ticker: req.params.trip_id }, function (err, trip) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.json({ message: 'Trip successfully deleted' });
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500);
        res.json({ message: "Internal Error" });
        return
    }
};

exports.cancel_a_trip = async function (req, res) {
    try {
        let trip = await Trip.findOneAndUpdate({ ticker: req.params.trip_id }, { cancelled: true }, {
            new: true
        });

        if (!trip) {
            logger.error(`ERROR: -GET /trip/${req.params.trip_id} - Not found trip with id: ${req.params.trip_id}`);
            return res.status(404).send({
                message: "Trip not found with id " + req.params.trip_id
            });
        }
        res.send(trip);
        return

    } catch (err) {
        logger.error(`Error cancelling trip ${req.params.trip_id} `)
        return res.status(500).send({
            message: "Error cancelling trip with id " + req.params.trip_id
        });
    }
};