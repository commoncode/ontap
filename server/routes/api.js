/**
 * REST API router
 */

const Router = require('express').Router;
const bodyParser = require('body-parser');
const _ = require('lodash');

const db = require('lib/db');
const log = require('lib/logger');

const router = new Router();
router.use(bodyParser.json());


const safeUserAttributes = ['id', 'name', 'avatar', 'admin'];
const adminUserAttributes = [...safeUserAttributes, 'email'];
const standardBeerAttributes = ['id', 'name', 'breweryName', 'notes', 'abv', 'ibu', 'variety'];

// log an error and send it to the client.
// todo - strip info out of the errors to
// prevent information leakage.
function logAndSendError(err, res) {
  log.error(err);
  return res.status(500).send(err);
}


// maybe consider moving these to submodules
// if we end up with too many of them...
function getOnTap(req, res) {
  db.Tap.findAll({
    include: [{
      model: db.Keg,
      include: [db.Cheers, {
        model: db.Beer,
        attributes: standardBeerAttributes,
      }],
    }],
  }).then(taps => res.send(taps))
  .catch(err => logAndSendError(err, res));
}

function getAllKegs(req, res) {
  db.Keg.findAll({
    include: [db.Cheers, db.Tap, {
      model: db.Beer,
      attributes: standardBeerAttributes,
    }],
    order: [
      ['tapped', 'DESC'],
    ],
  })
  .then(kegs => res.json(kegs))
  .catch(err => logAndSendError(err, res));
}

// kegs that haven't been tapped.
// ie, .tapped === null
// sequelize does some weird shit returning
// null date values, so we have to fetch all
// and do a filter instead.
// see the getter for `tapped` in models/keg.js
function getNewKegs(req, res) {
  db.Keg.findAll({
    // where: {
    //   tapped: null,
    // },
    include: [{
      model: db.Beer,
      attributes: standardBeerAttributes,
    },
    ],
  })
  .then(kegs => kegs.filter(keg => !keg.get('tapped')))
  .then(kegs => res.json(kegs))
  .catch(err => logAndSendError(err, res));
}

function getKegById(req, res) {
  db.Keg.findById(req.params.id, {
    include: [{
      model: db.Cheers,
      include: [{
        model: db.User,
        attributes: safeUserAttributes,
      }],
    }, {
      model: db.Beer,
      attributes: standardBeerAttributes,
    },
      db.Tap,
    ],
  })
  .then((keg) => {
    if (keg) return res.send(keg);
    return res.sendStatus(404);
  })
  .catch(err => logAndSendError(err, res));
}

function createKeg(req, res) {
  db.Keg.create(req.body, {})
  .then((keg) => {
    res.status(201).send(keg);
  })
  .catch(err => logAndSendError(err, res));
}

function updateKeg(req, res) {
  const id = req.params.id;
  db.Keg.update(req.body, {
    where: {
      id,
    },
  })
  .then(() => db.Keg.findById(req.params.id, {
    include: {
      model: db.Beer,
      attributes: standardBeerAttributes,
    },
  }))
  .then(keg => res.send(keg))
  .catch(err => logAndSendError(err, res));
}

function deleteKeg(req, res) {
  const id = req.params.id;
  db.Keg.destroy({
    where: {
      id,
    },
  })
  .then(res.sendStatus(204))
  .catch(err => res.send(err.status));
}

function getAllUsers(req, res) {
  db.User.findAll({
    attributes: safeUserAttributes,
  })
  .then(users => res.json(users))
  .catch(err => logAndSendError(err, res));
}

function getUserById(req, res) {
  const isAdmin = !!(req.user && req.user.admin);

  // todo - keep an eye on the performance of this
  db.User.findById(req.params.id, {
    include: [{
      model: db.Cheers,
      attributes: ['id', 'kegId', 'timestamp'],
      include: [{
        model: db.Keg,
        attributes: ['id'],
        include: [{
          model: db.Beer,
          attributes: ['name', 'breweryName'],
        }],
      }],
    }],
    attributes: isAdmin ? adminUserAttributes : safeUserAttributes,
  })
  .then((user) => {
    if (!user) return res.sendStatus(400);

    return res.send(user);
  })
  .catch(err => logAndSendError(err, res));
}


function updateUser(req, res) {
  const id = req.params.id;
  const props = _.pick(req.body, ['name', 'email', 'admin']);

  db.User.update(props, {
    where: {
      id,
    },
  })
  .then((numUpdated) => {
    if (numUpdated) {
      return db.User.findById(id)
      .then(user => res.send(user));
    }

    return res.status(404).send({});
  })
  .catch(error => logAndSendError(error, res));
}


function deleteUser(req, res) {
  const id = req.params.id;

  return db.User.destroy({
    where: {
      id,
    },
  })
  .then((numDestroyed) => {
    // if you were that user, log out
    if (req.user.id === id) {
      req.session.destroy();
    }
    return res.status(numDestroyed ? 204 : 404).send({});
  })
  .catch(error => logAndSendError(error, res));
}

function getAllBeers(req, res) {
  db.Beer.findAll()
  .then(rows => res.send(rows))
  .catch(err => logAndSendError(err, res));
}

function getBeerById(req, res) {
  db.Beer.findById(req.params.id, {
    include: [{
      model: db.User,
      as: 'addedByUser',
      attributes: safeUserAttributes,
    }, {
      model: db.Keg,
      include: [db.Cheers],
    }],
  })
  .then((beer) => {
    if (!beer) return res.sendStatus(404);
    return res.send(beer);
  })
  .catch(err => logAndSendError(err, res));
}

function createBeer(req, res) {
  const props = Object.assign({}, req.body, {
    addedBy: (req.user && req.user.id) || null,
  });

  db.Beer.create(props)
  .then(beer => db.Beer.findById(beer.id))
  .then(beer => res.send(beer))
  .catch((err) => {
    // sequelize validation error
    if (err.name && err.name === 'SequelizeValidationError') {
      return res.status(400).send(err);
    }

    // generic error
    return logAndSendError(err, res);
  });
}

function updateBeer(req, res) {
  const id = req.params.id;
  db.Beer.update(req.body, {
    where: {
      id,
    },
  })
  .then(() => db.Beer.findById(req.params.id))
  .then(beer => res.send(beer))
  .catch(err => logAndSendError(err, res));
}

function deleteBeer(req, res) {
  const id = req.params.id;
  db.Beer.destroy({
    where: {
      id,
    },
  })
  .then(() => res.sendStatus(204))
  .catch(err => logAndSendError(err, res));
}


function createTap(req, res) {
  db.Tap.create(req.body)
  .then((tap) => {
    res.status(201).send(tap);
  })
  .catch(err => logAndSendError(err, res));
}

function getAllTaps(req, res) {
  db.Tap.findAll({
    include: [db.Keg],
  }).then(taps => res.json(taps))
  .catch(err => logAndSendError(err, res));
}

function getTapById(req, res) {
  db.Tap.findById(req.params.id, {
    include: [{
      model: db.Keg,
      include: [{
        model: db.Beer,
        attributes: standardBeerAttributes,
      }],
    }],
  })
  .then((tap) => {
    if (!tap) return res.sendStatus(404);
    return res.send(tap);
  })
  .catch(err => logAndSendError(err, res));
}

function deleteTap(req, res) {
  const id = req.params.id;
  db.Tap.destroy({
    where: {
      id,
    },
  })
  .then(res.send(204))
  .catch(err => res.send(err.status));
}

/**
 * Cheers a Keg.
 */
function cheersKeg(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).send();
  }

  const kegId = req.params.id;
  const userId = req.user.id;

  return db.Keg.findById(kegId, {
    where: {
      tapped: {
        $ne: null,
      },
    },
  })
  .then((matchingKeg) => {
    if (!matchingKeg) {
      return res.sendStatus(404);
    }

    return db.Cheers.create({
      kegId,
      userId,
    })
    .then(() => {
      log.info(`${req.user.name} cheers'd keg #${kegId}`);
      return db.Keg.findById(kegId, {
        include: [db.Cheers, db.Tap, {
          model: db.Beer,
          attributes: standardBeerAttributes,
        }],
      });
    })
    .then((keg) => {
      res.send(keg.get());
    })
    .catch((err) => {
      log.error(err);
      res.status(500).send(err);
    });
  });
}

/**
 * Change the Keg on a Tap.
 *
 * @param  {Number} options.tapId    tapId
 * @param  {Number} options.kegId    kegId
 * @param  {String} options.tapped   tapped datestamp
 * @param  {String} options.untapped untapped datestamp
 * @return {Promise}                 resolves to Tap model
 */
function changeKeg({ tapId, kegId, tapped, untapped }) {
  return Promise.resolve()
  .then(() => {
    if (!tapId) {
      throw new Error(400); // need a tapId or you're doing nothing
    }

    return db.sequelize.transaction(() => Promise.all([
      db.Tap.findById(tapId, {
        include: db.Keg,
      }),
      db.Keg.findById(kegId),
    ])
    .then(([tap, targetKeg]) => {
      // todo - are these 404s or 400s?
      if (!tap) throw new Error(404); // tap not found
      if (kegId && !targetKeg) throw new Error(400); // keg by kegId not found

      const oldKeg = tap.Keg || null;
      const newKeg = targetKeg || null;

      const updates = [];

      // set the new keg (or null) on the tap
      updates.push(tap.setKeg(newKeg));

      // set the untapped date on the old keg,
      // default to now.
      if (oldKeg) {
        updates.push(oldKeg.update({
          untapped: untapped || Date.now(),
        }));
      }

      // set the tapped date on the keg we're tapping,
      // default to now.
      if (newKeg) {
        updates.push(newKeg.update({
          tapped: tapped || Date.now(),
        }));
      }

      return Promise.all(updates);
    })
    .then(() => db.Tap.findById(tapId, {
      include: [{
        model: db.Keg,
        include: {
          model: db.Beer,
          attributes: standardBeerAttributes,
        },
      }],
    })));
  });
}


function changeKegHandler(req, res) {
  const payload = {
    tapId: req.params.id,
    kegId: req.body.kegId,
    tapped: req.body.tapped,
    untapped: req.body.untapped,
  };

  return changeKeg(payload)
  .then((tap) => {
    res.status(201).send(tap);
  })
  .catch((err) => {
    // todo - handle errors here properly
    // API should always return consistent errors

    // errors from changeKeg()
    if (err.message && (err.message === '404' || err.message === '400')) {
      return res.status(err.message).send(err);
    }

    // sequelize error
    if (err.name && err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).send({
        message: 'Keg is already assigned to another Tap',
      });
    }

    // something else
    return res.status(500).send(err);
  });
}


// auth middleware.

// prevent guests from hitting endpoints
function usersOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).send();
  }
  return next();
}

// prevent non-admins from hitting endpoints.
function adminsOnly(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).send();
  }
  return next();
}

// simulate a slow connection.
// change the timeout to make it work.
function simulateCommonCodeInternet(req, res, next) {
  setTimeout(next, 0);
}
router.use(simulateCommonCodeInternet);


// return the current User
function getProfile(req, res) {
  res.send(req.user || {});
}

// return Cheers for the current user
function getProfileCheers(req, res) {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = req.user.id;

  return db.Cheers.findAll({
    include: [{
      model: db.Keg,
      attributes: ['id'],
      include: [{
        model: db.Beer,
        attributes: ['name', 'breweryName'],
      }],
    }],
    where: {
      userId,
    },
  })
  .then(cheers => res.send(cheers))
  .catch(error => logAndSendError(error, res));
}

// update current user
function updateProfile(req, res) {
  const id = req.user.id;
  const props = _.pick(req.body, ['name', 'email']);

  return db.User.update(props, {
    where: {
      id,
    },
  })
  .then(() => db.User.findById(id))
  .then(user => res.send(user))
  .catch(error => logAndSendError(error, res));
}

// delete current user
function deleteProfile(req, res) {
  const id = req.user.id;

  return db.User.destroy({
    where: {
      id,
    },
  })
  .then(() => {
    // if you were that user, log out
    if (req.user.id === id) {
      req.session.destroy();
    }
    return res.sendStatus(204);
  })
  .catch(error => logAndSendError(error, res));
}

router.get('/ontap', getOnTap);
router.get('/kegs', getAllKegs);
router.get('/kegs/new', getNewKegs); // todo - is this a bad url pattern?
router.get('/kegs/:id', getKegById);
router.get('/taps', getAllTaps);
router.get('/taps/:id', getTapById);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/beers', getAllBeers);
router.get('/beers/:id', getBeerById);
router.get('/profile', getProfile);


// guests can't use endpoints below this middleware
router.use(usersOnly);

router.post('/kegs/:id/cheers', cheersKeg);
router.post('/beers', createBeer);
router.get('/profile/cheers', getProfileCheers);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);


// admins only for all endpoints below this middleware
router.use(adminsOnly);

router.post('/kegs', createKeg);
router.put('/kegs/:id', updateKeg);
router.delete('/kegs/:id', deleteKeg);
router.post('/taps', createTap);
router.post('/taps/:id/keg', changeKegHandler);
router.delete('/taps/:id', deleteTap);
router.put('/beers/:id', updateBeer);
router.delete('/beers/:id', deleteBeer);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
