/**
 * Seed data.
 * Primarily for tests, but you could use it to populate an instance.
 */

const db = require('lib/db');

// you need an empty DB before running the seeds
// because we specify the ids here.

const user = {
  name: 'Test User',
  email: 'test@mail.com',
  googleProfileId: 'foobarqux',
  id: 1,
};

const brewery = {
  id: 1,
  name: 'Test Brewery',
  location: 'Collingwood',
  web: 'testbrewery.com',
  description: 'Just a test brewery.',
  adminNOtes: 'Just test admin notes',
  canBuy: false,

};

const beer = {
  id: 1,
  name: 'Test Beer',
  breweryId: 1,
  abv: 5.0,
  ibu: 30,
  variety: 'Pale Ale',
  notes: 'A test pale ale',
  canBuy: false,
  addedBy: 1,
};

const keg = {
  id: 1,
  notes: 'A test keg',
  beerId: 1,
};

const card = {
  id: 1,
  name: 'Test Card',
  uid: 'foobarqux',
  userId: 1,
};

function seed() {
  return db.User.create(user)
  .then(() => db.Brewery.create(brewery))
  .then(() => db.Beer.create(beer))
  .then(() => db.Keg.create(keg))
  .then(() => db.Card.create(card));
}

module.exports = {
  seed,
  user,
  brewery,
  beer,
  keg,
  card,
};
