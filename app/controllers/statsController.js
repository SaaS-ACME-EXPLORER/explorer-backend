'use strict';
/*---------------TRIP----------------------*/
const Trips = require('../models/Trips');
//const Trip = require('../models/Trip');

exports.by_managers = (req, res) => {
    // db.trips.aggregate([
    //     {
    //        $group: { 
    //            _id: {managedBy : "$managedBy" }, 
    //            total: { 
    //                $sum: 1 
    //            } 
    //        }
    //    }
    //    ])
       
       
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
