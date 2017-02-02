/**
 * ontap server
 */

// config
require('dotenv-safe').load();
require('app-module-path').addPath(__dirname);


// deps
const cookieParser = require('cookie-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);


// local deps
const logger = require('lib/logger');
const apiRouter = require('routes/api');
const passportRouter = require('lib/passport').router;
const db = require('lib/db');

const app = express();


// log all requests
app.use(morgan('dev', {
  stream: logger.morganStream,
}));

// sessions
app.use(cookieParser());
app.use(session({
  secret: 'howgoodisbeer',
  store: new SessionStore({
    db: db.sequelize,
  }),
  proxy: true,
  resave: false,
  saveUninitialized: true,
}));

// passport middleware for auth
app.use(passport.initialize());
app.use(passport.session());

// simulates a user being logged in.
// set USER_ID to falsey to skip.
app.use((req, res, next) => {
  const USER_ID = Number(process.env.SIMULATE_USER_ID) || null;
  if (!USER_ID) {
    return next();
  }

  return db.User.findById(USER_ID)
  .then((user) => {
    req.user = (user && user.get({ plain: true })) || null; // eslint-disable-line no-param-reassign
    next();
  });
});


// routes
app.use('/public/', express.static('public'));
app.use(express.static('client/dist'));
app.use('/api/v1/', apiRouter);
app.use(passportRouter);

// listen up
const server = http.Server(app); // eslint-disable-line new-cap
server.listen(process.env.PORT, () => {
  logger.info(`ontap listening on ${process.env.PORT}`);
});
