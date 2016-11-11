/**
 * logger.
 * log with winston.
 */

const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
    }),
  ],
});

// pipe morgan's request logs to debug
logger.morganStream = {
  write: logger.debug,
};

module.exports = logger;
