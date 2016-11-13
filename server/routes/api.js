/**
 * REST API router
 */

const Router = require('express').Router;
const bodyParser = require('body-parser');

const db = require('lib/db');
const log = require('lib/logger');

const router = new Router();
router.use(bodyParser.json());


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
    include: [db.Rating],
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
  db.Keg.findById(req.params.id)
  .then((keg) => {
    if (keg) return res.send(keg);
    return res.sendStatus(404);
  })
  .catch(err => logAndSendError(err, res));
}

function createKeg(req, res) {
  db.Keg.create(req.body)
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
  .then(res.send(204))
  .catch(err => res.send(err.status));
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
  .then((instance) => {
    log.info(`${req.user.name} rated keg #${kegId} a ${value}`);
    res.send(instance.get());
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
    if (err.message && err.message === '404' || err.message === '400') {
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

// guests can't use endpoints below this middleware
router.use(usersOnly);
router.put('/kegs/:id/rate', rateKeg);

// admins only for all endpoints below this middleware
router.use(adminsOnly);

router.post('/kegs', createKeg);
router.put('/kegs/:id', updateKeg);
router.delete('/kegs/:id', deleteKeg);
router.post('/taps', createTap);
router.post('/taps/:id/keg', changeKegHandler);
router.delete('/taps/:id', deleteTap);

module.exports = router;
