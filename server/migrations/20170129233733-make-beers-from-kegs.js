/**
 * Adds .beerId as an FK from Keg to Beer.
 * Creates Beers for all existing Kegs, copying properties.
 * Removes beer-related columns from the Keg.
 */

require('app-module-path').addPath(__dirname + '/../');
require('dotenv-safe').load({
  path: '.env',
  sample: '.env.example',
});

const db = require('lib/db');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Kegs', 'beerId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: 'Beers',
        key: 'id',
      },
    })
    .then(() => db.Keg.findAll())
    .then(kegs => Promise.all(kegs.map((keg) => {
      const { beerName, breweryName, abv, notes } = keg.get();
      return db.Beer.create({
        name: beerName,
        breweryName,
        abv,
        notes,
      })
      .then(beer => keg.update({
        beerId: beer.get('id'),
        notes: '',
      }));
    })))
    .then(() => queryInterface.removeColumn('Kegs', 'beerName'))
    .then(() => queryInterface.removeColumn('Kegs', 'breweryName'))
    .then(() => queryInterface.removeColumn('Kegs', 'abv'));
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Kegs', 'beerName', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'beer name',
      }),
      queryInterface.addColumn('Kegs', 'breweryName', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'brewery name',
      }),
      queryInterface.addColumn('Kegs', 'abv', Sequelize.DataTypes.FLOAT),
    ])
    .then(() => db.Keg.findAll())
    .then(kegs => Promise.all(kegs.map((keg) => {
      return db.Beer.findById(keg.get('beerId'))
      .then((beer) => {
        if (!beer) return null;
        const { name, breweryName, abv } = beer.get();
        return keg.update({
          beerName: name,
          breweryName,
          abv,
        });
      });
    })))
    .then(() => queryInterface.removeColumn('Kegs', 'beerId'));
  },
};
