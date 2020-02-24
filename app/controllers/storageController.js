'use strict';
const mongoose = require('mongoose');
const generate = require('nanoid/generate');

const logger = require('../utils/logger');
const Trip = require('../models/Trip');
const Application = require('../models/Application');
const Finder = require('../models/Finder');
const Sponsorship = require('../models/Sponsorship');
const Actor = require('../models/Actor');
const Stage = require('../models/Stage');



exports.store_json_insertMany = function (req, res) {
  logger.info('Inserting data, wait a momment');
  var mongooseModel, source = null;
  var response = '';

  var fs = require('fs');
  var dummyjson = require('dummy-json');

  var myHelpers = {
    language: function () {
      return dummyjson.utils.randomArrayItem(['en', 'es']);
    },
    role: function () {
      return dummyjson.utils.randomArrayItem(['SPONSOR', 'MANAGER', 'ADMINISTRATOR', 'EXPLORER']);
    },
    status: function () {
      return dummyjson.utils.randomArrayItem(['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']);
    },
    actorId: function () {
      return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 15);
    },
    tripId: function () {
      return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 15);
    },
    stageId: function () {
      return generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 15);
    }


  };

  // version con json separado por modelo
  var templates = fs.readFileSync(BASE_DIR + '\\app\\utils\\templates.hbs', { encoding: 'utf8' });
  var parsedTemplate = JSON.parse(dummyjson.parse(templates, { helpers: myHelpers }));

  // intento de sincronizacion, todo dentro del mismo objecto
  // var templates = fs.readFileSync(BASE_DIR + '\\app\\utils\\templates2.hbs', { encoding: 'utf8' });
  // dummyjson.seed = 'helloworld';
  // var parsed = dummyjson.parse(templates, { helpers: myHelpers });
  // var parsedTemplate = JSON.parse(dummyjson.parse(templates, { helpers: myHelpers }));


  if (parsedTemplate) {

    Object.keys(parsedTemplate).forEach(function (key, index) {

      mongooseModel = key;
      source = parsedTemplate[key];
      var collectionModel = mongoose.model(mongooseModel);

      console.log('Inserting ' + source.length + ' documents into the Model ' + mongooseModel);
      collectionModel.insertMany(source, function (err, result) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res = 'All documents stored in the ' + mongooseModel;
          console.log(res);
          response += res;
        }
      });
    });
  }
  else {
    response += 'Malformed template.';
    console.log(response);
  }
  res.send(response);

};

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