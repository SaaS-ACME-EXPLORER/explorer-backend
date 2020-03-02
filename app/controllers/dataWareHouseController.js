
const async = require("async");
const mongoose = require('mongoose');
const DataWareHouse = require('../models/dataWareHouseModel'); //created model loading here
const Trips = require('../models/Trip');
const Applications = require('../models/Application');

exports.list_all_indicators = function (req, res) {
  console.log('Requesting indicators');

  DataWareHouse.find().sort("-computationMoment").exec(function (err, indicators) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(indicators);
    }
  });
};

exports.last_indicator = function (req, res) {

  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function (err, indicators) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *';  //El que se usará por defecto
var computeDataWareHouseJob;

exports.rebuildPeriod = function (req, res) {
  console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob() {
  computeDataWareHouseJob = new CronJob(rebuildPeriod, function () {
    var new_dataWareHouse = new DataWareHouse();
    console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod);
    async.parallel([
      TripsPerManager,
      ApplicationPerTrips,
      PricePerTrips,
      computeRatio
      //computeRatioCancelledOrders
    ], function (err, results) {
      if (err) {
        console.log("Error computing datawarehouse: " + err);
      }
      else {

        new_dataWareHouse.minTripsPerManager = results[0].min
        new_dataWareHouse.maxTripsPerManager = results[0].max
        new_dataWareHouse.averageTripsPerManager = results[0].avg
        new_dataWareHouse.standarDeviationTripsPerManager = results[0].stdDev
        new_dataWareHouse.minApplicationsPerTrip = results[1].min
        new_dataWareHouse.maxApplicationsPerTrip = results[1].max
        new_dataWareHouse.averageApplicationsPerTrip = results[1].avg
        new_dataWareHouse.standarDeviationApplicationsPerTrip = results[1].stdDev
        new_dataWareHouse.minPricePerTrip = results[2].min
        new_dataWareHouse.maxPricePerTrip = results[2].max
        new_dataWareHouse.averagePricePerTrip = results[2].avg
        new_dataWareHouse.standarDeviationPricePerTrip = results[2].stdDev
        new_dataWareHouse.ratios = results[3]

          // //console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
          // new_dataWareHouse.topCancellers = results[0];
          // new_dataWareHouse.topNotCancellers = results[1];
          // new_dataWareHouse.bottomNotCancellers = results[2];
          // new_dataWareHouse.topClerks = results[3];
          // new_dataWareHouse.bottomClerks = results[4];
          // new_dataWareHouse.ratioCancelledOrders = results[5];
          new_dataWareHouse.rebuildPeriod = rebuildPeriod;
          console.log(results)
          //console.log(new_dataWareHouse)
          // new_dataWareHouse.save(function (err, datawarehouse) {
        //   if (err) {
        //     console.log("Error saving datawarehouse: " + err);
        //   }
        //   else {
        //     console.log("new DataWareHouse succesfully saved. Date: " + new Date());
        //   }
        // });
      }
    });
  }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

let TripsPerManager = (callback) => {

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
          avg: { $avg: "$count" },
          stdDev: { $stdDevPop: "$count" }
        }
      },
      {
        $project: {
          _id: 0,
          max: "$max",
          min: "$min",
          avg: "$avg",
          stdDev: "$stdDev"
        }
      }

    ],
    (err, res) => {
      callback(err, res[0])
    }
  )


}

let ApplicationPerTrips = (callback) => {
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
          avg: { $avg: "$count" },
          stdDev: { $stdDevPop: "$count" }
        }
      },
      {
        $project: {
          _id: 0,
          max: "$max",
          min: "$min",
          avg: "$avg",
          stdDev: "$stdDev"
        }
      }

    ],
    (err, res) => {
      callback(err, res[0])
    }
  )
}

let PricePerTrips = (callback) => {
  Trips.aggregate([
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
        avg: { $avg: "$price" },
        stdDev: { $stdDevPop: "$count" }
      }
    },
    {
      $project: {
        _id: 0,
        max: "$max",
        min: "$min",
        avg: "$avg",
        stdDev: "$stdDev"
      }
    }

  ], (err, res) => {
    callback(err, res[0])
  }
  )
}

let computeRatio = (callback) => {
  Applications.aggregate([
    {
      $facet: {
        "totalApp": [{ $group: { _id: null, total: { $sum: 1 } } }],
        "groupedByStatus": [{ $group: { _id: "$status", groupbystatus: { $sum: 1 } } }]
      }
    },
    { $project: { _id: 0, statuses: "$groupedByStatus", apps: "$totalApp.total" } },
    { $unwind: "$apps" },
    { $unwind: "$statuses" },
    { $project: { _id: 0, status: "$statuses._id", ratio: { $divide: ["$statuses.groupbystatus", "$apps"] } } }
  ],
    (err, res) => {
      callback(err, res)
    })



  // Applications.countDocuments({}, function(err, total){
  //   Applications.aggregate(
  //     [
  //       {
  //         $group: {
  //           _id: { status: "$status" },
  //           count: { $sum: 1 },
  //         }
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           status: "$_id.status",
  //           percentage: { $divide: ["$count", total] }
  //         }
  //       }
  //     ],
  //     (err, res) => {
  //       callback(err, res)
  //     }
  //   )

  // });


}

