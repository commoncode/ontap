/**
 * REST API router
 */

const Router = require('express').Router;
const bodyParser = require('body-parser');

const db = require('lib/db');

const router = new Router();
router.use(bodyParser.json());


// maybe consider moving these to submodules
// if we end up with too many of them...
function getActiveBeers(req, res) {
  db.Beer.findAll({
    where: {
      active: true,
    },
  }).then(activeBeers => res.send(activeBeers));
}

function getAllBeers(req, res) {
  db.Beer.findAll().then(beers => res.json(beers));
}

function getBeerById(req, res) {
  db.Beer.findById(req.params.id)
  .then((beer) => {
    if (beer) return res.send(beer);
    return res.sendStatus(404);
  });
}

function createBeer(req, res) {
  db.Beer.create(req.body)
  .then((beer) => {
    res.status(201).send(beer);
  });
}

function updateBeer(req, res) {
  const id = req.params.id;
  db.Beer.update(req.body, {
    where: {
      id,
    },
  })
  .then(beer => res.send(beer));
}

function deleteBeer(req, res) {
  const id = req.params.id;
  db.Beer.destroy({
    where: {
      id,
    },
  }).then(res.send(204))
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
