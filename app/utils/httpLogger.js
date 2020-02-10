const morgan = require('morgan');
const logger  = require('./logger');
const chalk = require("chalk")

logger.stream = {
  write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

module.exports = morgan(
    chalk.blue(':method') +  chalk.green(' :url')+ chalk.red(' :status')+' :response-time ms - :res[content-length]',
  { stream: logger.stream }
);
