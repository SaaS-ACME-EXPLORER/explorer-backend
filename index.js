
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const dbConnect = require('./db');
const datawarehouse = require('./app/controllers/dataWareHouseController')
const { httpLogger, logger } = require('./app/utils');
const https = require("https");
const fs = require("fs");


const options = {
    key: fs.readFileSync('./app/keys/server.key'),
    cert: fs.readFileSync('./app/keys/server.cert')
  };


global.BASE_API_PATH = "/api/v1";
global.BASE_API_PATH_V2 = "/api/v2";
global.BASE_DIR = __dirname;

var app = express();
logger.info('Setting up API server');

app.use(httpLogger);
app.use(bodyParser.json());

var admin = require("firebase-admin");

var serviceAccount = require("./acme-explorer-1bfd7-firebase-adminsdk-77ef8-20c05cb372");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, idToken" //ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
    );
    //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://acme-explorer-1bfd7.firebaseio.com"
});


// Setting up database
logger.info("Setting up database");

mongoose.Promise = global.Promise;

// logger.info(`Connecting to ${config.url + config.dbPort + ':' + config.dbPort + '/' + config.collectionName}!`);
logger.info(`Connecting to ${config.url}!`);

dbConnect().then(() => {
    logger.info("Successfully connected to the database")
    // Require routes routes
    require('./app/routes/')(app);
   
    // https.createServer(options, app).listen(config.port);

    app.listen(config.port, () => {
        logger.info(`Express App listening on port ${config.port}!`)
        // require('./app/services/populate.js').populate();
    });
}).catch(err => {
    logger.error('Could not connect to the database. Exiting now...', err);
    process.exit();
});
datawarehouse.createQubeRecollector()
datawarehouse.createDataWareHouseJob()


module.exports = app;



