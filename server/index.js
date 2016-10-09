/**
 * ontap server
 */

require('dotenv').config();

const express = require('express');
const http = require('http');
const morgan = require('morgan');


// allows local require() calls to be relative to current directory
require('app-module-path').addPath(__dirname);


const logger = require('lib/logger');

const app = express();

// log requests
app.use(morgan('dev', {
  stream: logger.morganStream,
}));


// statically serve the client up
app.use(express.static('client/dist'));


// listen up
const server = http.Server(app); // eslint-disable-line new-cap
server.listen(process.env.PORT, () => {
  logger.info(`ontap listening on ${process.env.PORT}`);
});
