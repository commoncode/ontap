/**
 * ontap server
 */

// config
require('dotenv').config();
require('app-module-path').addPath(__dirname);


// deps
const express = require('express');
const http = require('http');
const morgan = require('morgan');

// local deps
const logger = require('lib/logger');
const apiRouter = require('routes/api');

const app = express();

// log all requests
app.use(morgan('dev', {
  stream: logger.morganStream,
}));


// serve the client app
app.use(express.static('client/dist'));


// serve the api
app.use('/api/v1/', apiRouter);

// listen up
const server = http.Server(app); // eslint-disable-line new-cap
server.listen(process.env.PORT, () => {
  logger.info(`ontap listening on ${process.env.PORT}`);
});
