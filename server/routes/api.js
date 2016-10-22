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
function getActiveBeers(req, res) {
  db.Beer.findAll({
    where: {
      active: true,
    },
  }).then(activeBeers => res.send(activeBeers))
  .catch(err => logAndSendError(err, res));
}

function getAllBeers(req, res) {
  db.Beer.findAll().then(beers => res.json(beers))
  .catch(err => logAndSendError(err, res));
}

function getBeerById(req, res) {
  db.Beer.findById(req.params.id)
  .then((beer) => {
    if (beer) return res.send(beer);
    return res.sendStatus(404);
  })
  .catch(err => logAndSendError(err, res));
}

function createBeer(req, res) {
  db.Beer.create(req.body)
  .then((beer) => {
    res.status(201).send(beer);
  })
  .catch(err => logAndSendError(err, res));
}

function updateBeer(req, res) {
  const id = req.params.id;
  db.Beer.update(req.body, {
    where: {
      id,
    },
  })
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
  .then(res.send(204))
  .catch(err => res.send(err.status));
}

// auth middleware.
// prevent non-admins from hitting endpoints.
function adminsOnly(req, res, next) {
  if (!req.user || !req.user.admin) {
    return res.status(403).send();
  }
  return next();
}

router.get('/ontap', getActiveBeers);
router.get('/beers', getAllBeers);
router.get('/beers/:id', getBeerById);

// admins only for all endpoints below this middleware
router.use(adminsOnly);

router.post('/beers', createBeer);
router.put('/beers/:id', updateBeer);
router.delete('/beers/:id', deleteBeer);

module.exports = router;
