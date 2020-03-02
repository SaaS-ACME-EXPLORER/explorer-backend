
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const dbConnect = require('./db');
const datawarehouse = require('./app/controllers/dataWareHouseController')
const { httpLogger, logger } = require('./app/utils');


global.BASE_API_PATH = "/api/v1"
global.BASE_DIR = __dirname;

var app = express();
logger.info('Setting up API server');

app.use(httpLogger);
app.use(bodyParser.json());



// Setting up database
logger.info("Setting up database");

mongoose.Promise = global.Promise;

logger.info(`Connecting to ${config.url}!`);

dbConnect().then(() => {
    logger.info("Successfully connected to the database")
    // Require routes routes
    require('./app/routes/')(app);
    app.listen(config.port, () => {
        logger.info(`Express App listening on port ${config.port}!`)
        // require('./app/services/populate.js').populate();
    });
}).catch(err => {
    logger.error('Could not connect to the database. Exiting now...', err);
    process.exit();
});

datawarehouse.createDataWareHouseJob()


module.exports = app;



