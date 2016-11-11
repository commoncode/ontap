/* eslint-disable no-underscore-dangle */

/**
 * Passport lib: auth-related bits and pieces.
 */

const Router = require('express').Router;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require('lib/db');
const log = require('lib/logger');


// callback used by the Google Strategy.
// passes us a google profile which we'll use to either fetch an existing
// user out of the database or create a new one.
function googleStrategyCallback(accessToken, refreshToken, googleProfile, callback) {
  // get some basic details from our google profile
  const googleProfileId = googleProfile.id;
  const name = googleProfile._json.displayName;
  const email = googleProfile.emails[0].value; // first one will do.
  const avatar = googleProfile._json.image.url.replace(/\?sz=\d*$/, '');

  db.User.findOrCreate({
    where: {
      googleProfileId,
    },
    defaults: {
      name,
      email,
      avatar,
    },
  })
  .spread(user => callback(null, user.get({ plain: true })))
  .catch((err) => {
    log.error(err);
    return callback(err);
  });
}

// configure the google oauth2 strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
}, googleStrategyCallback));

// serialize a user object for storage in a session.
// we just want to store the userId.
passport.serializeUser((userObject, done) => {
  done(null, userObject.id);
});

// now back the other way.
// userId in session to full user object.
passport.deserializeUser((userId, done) => {
  db.User.findById(userId)
  .then((user) => {
    if (!user) return done(null, {});
    return done(null, user.get({ plain: true }));
  })
  .catch(err => done(err));
});


// configure routes
const router = new Router();

// login with google
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// easier-to-remember alias for logging in
router.get('/login', (req, res) => {
  res.redirect('/auth/google');
});

// google callback
// Google's OAuth mechanism redirects the user back to here
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

// logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// tell the user who they are.
router.get('/whoami', (req, res) => {
  res.send(req.user || {});
});


module.exports = {
  router,
};
