/**
 * seed data
 */

const db = require('lib/db');


// three taps
const TAPS = [{
  name: 'Left Tap',
}, {
  name: 'Middle Tap',
}, {
  name: 'Right Tap',
}];

// three kegs
const KEGS = [{
  beerName: 'Love Tap',
  breweryName: 'Moon Dog',
  abv: 5,
  notes: 'A delicious lager.',
}, {
  beerName: 'Pilsner',
  breweryName: 'Hawkers',
  abv: 5,
  notes: 'Excellent pilsner, very pilsnery.',
}, {
  beerName: 'Brown Ale',
  breweryName: 'Cavalier Brewing',
  abv: 5.5,
  notes: 'The perfect mix of chocolate and toasty caramel flavours. With the added complexity of aromas from classic American hops, subtle citrus notes reveal something new in every sip.',
}];


function seed() {
  // create the taps
  return Promise.all(TAPS.map(tap => db.Tap.create(tap)))
  .then((taps) => {
    // create the kegs
    return Promise.all(KEGS.map(keg => db.Keg.create(keg)))
    .then((kegs) => {

      return Promise.all([
        taps[0].setKeg(kegs[0]),
        taps[1].setKeg(kegs[1])
      ]);

    });
  })
  .then(() => console.log('done'))
  .catch(err => console.log(err));
}

module.exports = seed;
