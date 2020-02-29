'use strict';
const mongoose = require('mongoose');
const generate = require('nanoid/generate');
const dateFormat = require('dateformat');
const Actor = require('../models/Actor');
const Trips = require('../models/Trip');
const Applications = require('../models/Application');
const Sponsorship = require('../models/Sponsorship');

const logger = require('../utils/logger');


exports.store_json_insertMany = async function (req, res) {
  logger.info('Parsing data, wait a momment');
  let response = '';

  const fs = require('fs');
  const dummyjson = require('dummy-json');

  const myHelpers = {
    language: function () {
      return dummyjson.utils.randomArrayItem(['en', 'es']);
    },
    role: function () {
      return dummyjson.utils.randomArrayItem(['SPONSOR', 'MANAGER', 'ADMINISTRATOR', 'EXPLORER']);
    },
    status: function () {
      return dummyjson.utils.randomArrayItem(['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']);
    },
    ticker: function () {

      let startDate = new Date(2012, 0, 1);
      let endDate = new Date();

      let randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

      let date = dateFormat(randomDate, "yymmdd");
      let generated_ticker = [date, generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)].join('-');
      return generated_ticker;

    },
    mongoID: function () {
      return mongoose.Types.ObjectId();
    }


  };

  // version con json separado por modelo
  let templates = fs.readFileSync(BASE_DIR + '\\app\\utils\\templates.hbs', { encoding: 'utf8' });
  let parsedTemplate = JSON.parse(dummyjson.parse(templates, { helpers: myHelpers }));

  // intento de sincronizacion, todo dentro del mismo objecto
  // var templates = fs.readFileSync(BASE_DIR + '\\app\\utils\\templates2.hbs', { encoding: 'utf8' });
  // dummyjson.seed = 'helloworld';
  // var parsed = dummyjson.parse(templates, { helpers: myHelpers });
  // var parsedTemplate = JSON.parse(dummyjson.parse(templates, { helpers: myHelpers }));


  if (parsedTemplate) {
    logger.info('Data parsed OK');

    console.log('Start')

    for (const key in parsedTemplate) {
      let mongooseModel = key;
      let source = parsedTemplate[key];
      var collectionModel = mongoose.model(mongooseModel);

      logger.info('Inserting ' + source.length + ' documents into the Model ' + mongooseModel);
      await _insert(collectionModel, source, res, mongooseModel);
    }
    console.log('End')
  }
  else {
    response += 'Malformed template.';
    logger.info(response);
  }
  res.status(200).send(response);
};

const _insert = async (collectionModel, source, res, mongooseModel) => {
  await collectionModel.insertMany(source, (err, result) => {
    if (err) {
      logger.error(err);
      res.send(err);
      return;
    } else {
      logger.info('All documents stored in the ' + mongooseModel);
    }
  });
}

exports.create_relations = async function (req, res) {
  let managersIds = await Actor.find({ role: 'MANAGER' }).distinct('_id');
  managersIds = managersIds.map(actor => actor._id.toString());

  const trips = await Trips.find();
  // const tripsIds = trips.map(trip => trip._id.toString());

  console.info('Saving trips');
  trips.forEach(async function (trip) {
    trip.managedBy = managersIds[Math.floor(Math.random() * managersIds.length)];
    await trip.save();

  });
  console.info('DONE Saving trips');

  console.info('Saving sponsorships');
  const sponsorships = await Sponsorship.find();
  sponsorships.forEach(async function (sponsorship, index) {
    sponsorship.tripId = trips[index]._id;
    await sponsorship.save();
  });
  console.info('DONE Saving sponsorships');


  let explorersIds = await Actor.find({ role: 'EXPLORER' }).distinct('_id');
  // explorersIds = explorersIds.map(actor => actor._id.toString());

  console.info('Saving appliations');
  const appliations = await Applications.find();
  appliations.forEach(async function (appliation) {
    appliation.tripId = trips[Math.floor(Math.random() * trips.length)]._id;
    appliation.explorerId = explorersIds[Math.floor(Math.random() * explorersIds.length)];
    await appliation.save();
  });
  console.info('DONE Saving appliations');

  console.info('Done');

  res.status(200).send();
}


exports.store_json_fs = function (req, res) {

  const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
  const JSONStream = require('JSONStream');
  const fs = require('fs');

  //var dbURL, collection, sourceURL, batchSize, parseString = null;
  var dbURL, collection, sourceFile, batchSize, parseString = null;
  var response = '';

  if (req.query.dbURL && req.query.collection && req.query.sourceFile) {
    dbURL = req.query.dbURL;
    collection = req.query.collection;
    sourceFile = req.query.sourceFile;
    if (req.query.batchSize) batchSize = req.query.batchSize; else batchSize = 1000;
    if (req.query.parseString) parseString = req.query.parseString; else parseString = '*.*';

    // where the data will end up
    const outputDBConfig = { dbURL: dbURL, collection: collection, batchSize: batchSize };

    // create the writable stream
    const writableStream = streamToMongoDB(outputDBConfig);

    // create readable stream and consume it
    console.log('starting streaming the json from file: ' + sourceFile + ', to dbURL: ' + dbURL + ', into the collection: ' + collection);
    fs.createReadStream(sourceFile) // './myJsonData.json'
      .pipe(JSONStream.parse(parseString))
      .pipe(writableStream)
      .on('finish', function () {
        response += 'All documents stored in the collection!';
        console.log(response);
        res.send(response);
      })
      .on('error', function (err) {
        console.log(err);
        res.send(err);
      })
  }
  else {
    if (req.query.dbURL == null) response += 'A mandatory dbURL parameter is missed.\n';
    if (req.query.collection == null) response += 'A mandatory collection parameter is missed.\n';
    if (req.query.sourceFile == null) response += 'A mandatory sourceFile parameter is missed.\n';
    console.log(response);
    res.send(response);
  }

};