/**
 * ontap server
 */

// config
require('dotenv-safe').load();
require('app-module-path').addPath(__dirname);


// deps
const path = require('path');
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


db.sequelize.sync().then(() => {
  logger.info('sequelize models synced');
});

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


// routes...

// client app jump off, index.html
app.get('/', (req, res) => {
  res.sendFile('client/dist/index.html', {
    root: path.join(__dirname, '../'),
  }, (error) => {
    if (error) {
      logger.error(error);
      res.status(500).send('Can\'t sendFile client/dist/index.html, did you build the client app?');
    }
  });
});
// all other client app assets
app.use('/assets', express.static('client/dist'));
app.use('/api/v1/', apiRouter);
app.use(passportRouter);
// todo - this one's just for the favicon, figure out how to push it into the webpack workflow
app.use('/public', express.static('public'));


// listen up
const server = http.Server(app); // eslint-disable-line new-cap
server.listen(process.env.PORT, () => {
  logger.info(`ontap listening on ${process.env.PORT}`);
});
