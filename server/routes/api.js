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
    include: [db.Keg],
  }).then(taps => res.send(taps))
  .catch(err => logAndSendError(err, res));
}

function getAllKegs(req, res) {
  db.Keg.findAll()
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
  db.Tap.findById(req.params.id)
  .then((tap) => {
    if (tap) return res.send(tap);
    return res.sendStatus(404);
  })
  .catch(err => logAndSendError(err, res));
}

// auth middleware.
// prevent non-admins from hitting endpoints.
function adminsOnly(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).send();
  }
  return next();
}

// function simulateCommonCodeInternet(req, res, next) {
//   setTimeout(next, 2000);
// }
// router.use(simulateCommonCodeInternet);

router.get('/ontap', getOnTap);
router.get('/kegs', getAllKegs);
router.get('/kegs/:id', getKegById);
router.get('/taps', getAllTaps);
router.get('/taps/:id', getTapById);

// admins only for all endpoints below this middleware
router.use(adminsOnly);

router.post('/kegs', createKeg);
router.put('/kegs/:id', updateKeg);
router.delete('/kegs/:id', deleteKeg);

router.post('/taps', createTap);

module.exports = router;
