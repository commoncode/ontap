/**
 * REST API router
 */

const Router = require('express').Router;
const bodyParser = require('body-parser');

const db = require('lib/db');
const log = require('lib/logger');

const router = new Router();
router.use(bodyParser.json());


const safeUserAttributes = ['id', 'name', 'avatar'];

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
      include: [db.Rating],
    }],
  }).then(taps => res.send(taps))
  .catch(err => logAndSendError(err, res));
}

function getAllKegs(req, res) {
  db.Keg.findAll({
    include: [db.Rating, db.Tap],
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
  })
  .then(kegs => kegs.filter(keg => !keg.get('tapped')))
  .then(kegs => res.json(kegs))
  .catch(err => logAndSendError(err, res));
}

function getKegById(req, res) {
  db.Keg.findById(req.params.id, {
    include: [{
      model: db.Rating,
      include: [db.User],
    }, db.Tap],
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
  .then(() => db.Keg.findById(req.params.id))
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

function getUserById(req, res) {
  // todo - keep an eye on the performance of this
  db.User.findById(req.params.id, {
    include: [{
      model: db.Rating,
      attributes: ['id', 'value', 'updatedAt'],
      include: [{
        model: db.Keg,
        attributes: ['id', 'beerName', 'breweryName'],
      }],
    }, {
      model: db.Vote,
      attributes: ['id', 'beerId'],
      include: [{
        model: db.Beer,
        attributes: ['id', 'name', 'breweryName'],
      }],
    }],
    attributes: safeUserAttributes,
  })
  .then((user) => {
    if (!user) return res.sendStatus(400);

    return res.send(user);
  })
  .catch(err => logAndSendError(err, res));
}

function getAllBeers(req, res) {
  db.Beer.findAll({
    include: [db.Vote],
  })
  .then(rows => res.send(rows))
  .catch(err => logAndSendError(err, res));
}

function getBeerById(req, res) {
  // bit of nesting happening here
  // todo - graphql
  // get the votes and their users,
  // and get the user who added the beer.
  db.Beer.findById(req.params.id, {
    include: [{
      model: db.Vote,
      include: {
        model: db.User,
        attributes: safeUserAttributes,
      },
    }, {
      model: db.User,
      as: 'addedByUser',
      attributes: safeUserAttributes,
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
  .then(beer => db.Beer.findById(beer.id, {
    include: [db.Vote],
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
    include: [db.Vote],
  }))
  .then(keg => res.send(keg))
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

// vote for a beer
function voteForBeer(req, res) {
  if (!req.user || !req.user.id) {
    return res.sendStatus(401);
  }

  const beerId = req.params.id;
  const userId = req.user.id;

  return db.Vote.findOrCreate({
    where: {
      beerId,
      userId,
    },
  })
  .then(() => db.Vote.findAll({ // return all votes
    where: {
      beerId,
    },
    include: [{
      model: db.User,
      attribues: safeUserAttributes,
    }],
  }))
  .then(votes => res.send(votes))
  .catch(err => logAndSendError(err, res));
}

// revoke my existing vote for a beer
function revokeVote(req, res) {
  if (!req.user || !req.user.id) {
    return res.sendStatus(401);
  }

  const beerId = req.params.id;
  const userId = req.user.id;

  return db.Vote.destroy({
    where: {
      beerId,
      userId,
    },
  })
  .then(() => db.Vote.findAll({ // return all votes
    where: {
      beerId,
    },
    include: [{
      model: db.User,
      attribues: safeUserAttributes,
    }],
  }))
  .then(votes => res.send(votes))
  .catch(err => logAndSendError(err, res));
}

// clear all the votes for a beer
function clearVotes(req, res) {
  const beerId = req.params.id;

  return db.Vote.destroy({
    where: {
      beerId,
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
    include: [db.Keg],
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
 * Rate a Keg.
 * Users can give a Keg a +1, 0 or -1.
 */
function rateKeg(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).send();
  }

  const kegId = req.params.id;
  const userId = req.user.id;
  const value = req.body.value;

  // if the rating already exists for this user
  // on this keg, then we need to update it.
  // otherwise we create it.
  return db.Rating.findOrCreate({
    where: {
      kegId,
      userId,
    },
    defaults: {
      value,
    },
  })
  .then((result) => {
    const [instance, created] = result;

    // instance is newly created, return it.
    if (created) {
      return instance;
    }

    // instance pre-exists, update and send.
    return instance.update({
      value,
    });
  })
  .then(() => {
    log.info(`${req.user.name} rated keg #${kegId} a ${value}`);
    return db.Keg.findById(kegId, {
      include: [db.Rating],
    });
  })
  .then((keg) => {
    res.send(keg.get());
  })
  .catch((err) => {
    log.error(err);
    res.status(500).send(err);
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
      include: db.Keg,
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

router.get('/ontap', getOnTap);
router.get('/kegs', getAllKegs);
router.get('/kegs/new', getNewKegs); // todo - is this a bad url pattern?
router.get('/kegs/:id', getKegById);
router.get('/taps', getAllTaps);
router.get('/taps/:id', getTapById);
router.get('/users/:id', getUserById);
router.get('/beers', getAllBeers);
router.get('/beers/:id', getBeerById);


// guests can't use endpoints below this middleware
router.use(usersOnly);

router.put('/kegs/:id/rate', rateKeg);
router.post('/beers', createBeer);
router.put('/beers/:id/vote', voteForBeer);
router.delete('/beers/:id/vote', revokeVote);


// admins only for all endpoints below this middleware
router.use(adminsOnly);

router.post('/kegs', createKeg);
router.put('/kegs/:id', updateKeg);
router.delete('/kegs/:id', deleteKeg);
router.post('/taps', createTap);
router.post('/taps/:id/keg', changeKegHandler);
router.delete('/taps/:id', deleteTap);
router.put('/beers/:id', updateBeer);
router.post('/beers/:id/clearvotes', clearVotes);
router.delete('/beers/:id', deleteBeer);

module.exports = router;
