/**
 * REST API router
 */

const Router = require('express').Router;
const bodyParser = require('body-parser');
const _ = require('lodash');

const db = require('lib/db');
const log = require('lib/logger');
const touchlib = require('lib/touches');
const tapontap = require('lib/tapontap');

const router = new Router();
router.use(bodyParser.json());

const { AUTH_TOKEN } = process.env;

// validate that we were sent the correct auth token
// currently we just load it from an env var
function validateAuthToken(request) {
  return request.get('authorization') === `Bearer: ${AUTH_TOKEN}`;
}

// default attributes to send over the wire
const userAttributesPublic = ['id', 'name', 'avatar', 'admin'];
const userAttributesAdmin = [...userAttributesPublic, 'email'];
const beerAttributesPublic = ['id', 'name', 'breweryId', 'notes', 'abv', 'ibu', 'variety'];
const breweryAttributesPublic = ['id', 'name', 'web', 'location', 'description', 'canBuy'];
const breweryAttributesAdmin = [...breweryAttributesPublic, 'adminNotes'];
const kegAttributesPublic = ['id', 'tapped', 'untapped', 'notes', 'beerId'];
const tapAttributesPublic = ['id', 'name', 'kegId'];
const cheersAttributesPublic = ['id', 'kegId', 'userId', 'timestamp'];


// include declarations for returning nested models

const breweryInclude = {
  model: db.Brewery,
  attributes: breweryAttributesPublic,
};

// beer + brewery
const beerInclude = {
  model: db.Beer,
  attributes: beerAttributesPublic,
  include: [breweryInclude],
};

const kegInclude = {
  model: db.Keg,
  attributes: kegAttributesPublic,
};

// keg + beer + brewery
const kegWithBeerInclude = {
  model: db.Keg,
  attributes: kegAttributesPublic,
  include: [beerInclude],
};

// cheers
const cheersInclude = {
  model: db.Cheers,
  attributes: cheersAttributesPublic,
};

// user
const userInclude = {
  model: db.User,
  attributes: userAttributesPublic,
};

// cheers + user
const cheersWithUserInclude = {
  model: db.Cheers,
  attributes: cheersAttributesPublic,
  include: [userInclude],
};

// cheers + keg + beer + brewery
const cheersWithBeerInclude = {
  model: db.Cheers,
  attributes: cheersAttributesPublic,
  include: [kegWithBeerInclude],
};

const tapInclude = {
  model: db.Tap,
  attributes: tapAttributesPublic,
};


// log an error and send it to the client.
// todo - strip info out of the errors to
// prevent information leakage.
function logAndSendError(err, res) {
  log.error(err);
  return res.status(500).send(err);
}


// ping, does nothing.
function ping(req, res) {
  return res.status(200).send({ ping: 'pong' });
}

// maybe consider moving these to submodules
// if we end up with too many of them...
function getOnTap(req, res) {
  db.Tap.findAll({
    attributes: tapAttributesPublic,
    include: [{
      model: db.Keg,
      attributes: kegAttributesPublic,
      include: [cheersInclude, beerInclude],
    }],
  }).then(taps => res.send(taps))
  .catch(err => logAndSendError(err, res));
}

function getAllKegs(req, res) {
  db.Keg.findAll({
    attributes: kegAttributesPublic,
    include: [cheersInclude, tapInclude, beerInclude],
    order: [
      ['tapped', 'DESC'],
    ],
  })
  .then(kegs => res.json(kegs))
  .catch(err => logAndSendError(err, res));
}

// kegs that haven't been tapped (tapped === null)
// sequelize/sqlite doesn't support null dates properly,
// so fetch all and filter.
// see the getter for `tapped` in models/keg.js
function getNewKegs(req, res) {
  db.Keg.findAll({
    attributes: kegAttributesPublic,
    include: [beerInclude],
  })
  .then(kegs => kegs.filter(keg => !keg.get('tapped')))
  .then(kegs => res.json(kegs))
  .catch(err => logAndSendError(err, res));
}

function getKegById(req, res) {
  db.Keg.findById(req.params.id, {
    attributes: kegAttributesPublic,
    include: [cheersWithUserInclude, beerInclude, tapInclude],
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
    include: [beerInclude],
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
    attributes: userAttributesPublic,
  })
  .then(users => res.json(users))
  .catch(err => logAndSendError(err, res));
}

function getUserById(req, res) {
  const isAdmin = !!(req.user && req.user.admin);

  db.User.findById(req.params.id, {
    include: [cheersWithBeerInclude],
    attributes: isAdmin ? userAttributesAdmin : userAttributesPublic,
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
  db.Beer.findAll({
    include: [breweryInclude],
  })
  .then(rows => res.send(rows))
  .catch(err => logAndSendError(err, res));
}

function getBeerById(req, res) {
  db.Beer.findById(req.params.id, {
    include: [Object.assign({}, userInclude, {
      as: 'addedByUser',
    }), {
      model: db.Keg,
      attributes: kegAttributesPublic,
      include: [cheersInclude],
    }, breweryInclude],
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
  .then(beer => db.Beer.findById(beer.id, {
    attributes: beerAttributesPublic,
  }))
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
  .then(() => db.Beer.findById(req.params.id, {
    attributes: beerAttributesPublic,
    include: [breweryInclude],
  }))
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
  .then(tap => res.status(201).send(tap))
  .catch(err => logAndSendError(err, res));
}

function getAllTaps(req, res) {
  db.Tap.findAll({
    attributes: tapAttributesPublic,
    include: [kegInclude],
  }).then(taps => res.json(taps))
  .catch(err => logAndSendError(err, res));
}

function getTapById(req, res) {
  db.Tap.findById(req.params.id, {
    attributes: tapAttributesPublic,
    include: [kegWithBeerInclude],
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
      // return all of the Cheers for the Keg
      return db.Cheers.findAll({
        where: {
          kegId,
        },
        attributes: cheersAttributesPublic,
        include: [userInclude],
      });
    })
    .then(cheers => res.send(cheers))
    .catch(err => logAndSendError(err, res));
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
      attributes: tapAttributesPublic,
      include: [kegWithBeerInclude],
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
    attributes: cheersAttributesPublic,
    include: [kegWithBeerInclude],
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
  .then(() => db.User.findById(id, {
    attributes: userAttributesAdmin,
  }))
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
    req.session.destroy();
    res.sendStatus(204);
  })
  .catch(error => logAndSendError(error, res));
}

function getAllBreweries(req, res) {
  return db.Brewery.findAll({
    attributes: breweryAttributesPublic,
  })
  .then(breweries => res.send(breweries))
  .catch(error => logAndSendError(error, res));
}

function getBreweryById(req, res) {
  return db.Brewery.findById(req.params.id, {
    attributes: (req.user && req.user.admin) ? breweryAttributesAdmin : breweryAttributesPublic,
    include: [{
      model: db.Beer,
      attributes: beerAttributesPublic,
    }],
  })
  .then((brewery) => {
    if (brewery) {
      return res.send(brewery);
    }
    return res.status(404).send({});
  })
  .catch(error => logAndSendError(error, res));
}

function updateBrewery(req, res) {
  const id = req.params.id;
  db.Brewery.update(req.body, {
    where: {
      id,
    },
  })
  .then(() => db.Brewery.findById(req.params.id, {
    attributes: breweryAttributesAdmin,
  }))
  .then(brewery => res.send(brewery))
  .catch(err => logAndSendError(err, res));
}

function deleteBrewery(req, res) {
  const id = req.params.id;
  db.Brewery.destroy({
    where: {
      id,
    },
  })
  .then(() => res.sendStatus(204))
  .catch(err => logAndSendError(err, res));
}

function createBrewery(req, res) {
  const props = req.body;

  db.Brewery.create(props)
  .then(brewery => db.Brewery.findById(brewery.id, {
    attributes: breweryAttributesAdmin,
  }))
  .then(brewery => res.send(brewery))
  .catch((err) => {
    // sequelize validation error
    if (err.name && err.name === 'SequelizeValidationError') {
      return res.status(400).send(err);
    }
    // generic error
    return logAndSendError(err, res);
  });
}

// receives an array of Touches from a TapOnTap instance
function receiveTouches(req, res) {
  // need a valid auth token to proceed
  if (!validateAuthToken(req)) {
    return res.status(401).send();
  }

  const touches = req.body;
  log.info(`received ${touches.length} ${touches.length === 1 ? 'touch' : 'touches'} from TapOnTap instance`);

  return touchlib.createTouches(touches)
  .then(() => res.status(200).send({ success: true }))
  .catch(error => logAndSendError(error, res));
}

function getAllTouches(req, res) {
  db.Touch.findAll()
  .then(touches => res.send(touches))
  .catch(error => logAndSendError(error, res));
}

function getAllCards(req, res) {
  db.Card.findAll({
    include: userInclude,
  })
  .then(cards => res.send(cards))
  .catch(error => logAndSendError(error, res));
}

// fetch the uid of the card currently tapped onto the
// reader of our TapOnTap instance
function getCardUid(req, res) {
  tapontap.getCurrentCard()
  .then(cardUid => res.send({ cardUid }))
  .catch((error) => {
    log.error('getCardUid()', error);
    switch (error.message) {
      case 'NETWORK_ERROR':
        res.status(504);
        break;
      case 'BAD_RESPONSE':
        res.status(502);
        break;
      default:
        res.status(500);
        break;
    }
    res.send({ error: error.message });
  });
}

// register a Card to a User
function registerCard(req, res) {
  const { uid } = req.body;
  if (!uid) return res.status(400).send({ error: 'uid required' });

  const name = req.body.name || 'NFC Token';
  const userId = req.user.id;

  return db.Card.create({
    uid,
    userId,
    name,
  })
  .then(card =>
    // Card's been registered. Try to reconcile any Touches
    // made with it and return their corresponding Cheers.
    touchlib.getUnreconciledTouches(uid)
    .then(touches => touchlib.reconcileTouches(touches))
    .then((reconciledTouches) => {
      const cheersIds = reconciledTouches.map(touch => touch.cheersId);
      return db.Cheers.findAll({
        where: {
          id: {
            $in: cheersIds,
          },
        },
        attributes: cheersAttributesPublic,
        include: [kegWithBeerInclude],
      });
    }).then(cheers => res.status(201).send({
      card,
      cheers,
    }))
  )
  .catch((error) => {
    // explicitly handle a conflicting uid
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).send({ error: 'CARD_EXISTS' });
    } else {
      logAndSendError(error, res);
    }
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

router.get('/ping', ping);
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
router.get('/breweries', getAllBreweries);
router.get('/breweries/:id', getBreweryById);
router.post('/touches', receiveTouches);

// guests can't use endpoints below this middleware
router.use(usersOnly);

router.post('/kegs/:id/cheers', cheersKeg);
router.post('/beers', createBeer);
router.get('/profile/cheers', getProfileCheers);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);
router.get('/cards/register', getCardUid);
router.post('/cards/register', registerCard);

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
router.put('/breweries/:id', updateBrewery);
router.delete('/breweries/:id', deleteBrewery);
router.post('/breweries', createBrewery);
router.get('/touches', getAllTouches);
router.get('/cards', getAllCards);

module.exports = router;
