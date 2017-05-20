/* eslint-disable no-console */

/**
 * Breweries migration.
 *
 * - Add Breweries table
 * - Beer.breweryId FK to Brewery.id
 * - Create Breweries based on Beer.breweryName
 * - Add .breweryId to each Beer
 * - Drop Beer.breweryName
 */

const path = require('path');

require('app-module-path').addPath(path.join(__dirname, '/../'));
require('dotenv-safe').load({
  path: '.env',
  sample: '.env.example',
});

const db = require('lib/db');

module.exports = {
  up(queryInterface, DataTypes) {
    // note!
    // Sequelize's changeColumn() doesn't work on a foreignKey column.
    // so we have to add breweryId as NULL, and aren't able to change
    // it to NOT NULL later.
    // todo... ?


    // Brewery model is defined in models/brewery
    // run sync() to ensure it's created
    return db.sequelize.sync()

    // add breweryId to Beers; nullable at first.
    .then(() => queryInterface.addColumn('Beers', 'breweryId', {
      type: DataTypes.INTEGER,
      references: {
        model: 'Breweries',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }))
    .then(() => db.Beer.findAll({
      attributes: ['id', 'name', 'breweryName'],
    }))
    // for each beer, findOrCreate a matching brewery, point the beer to it.
    // the reducer runs the promises sequentially.
    .then(beers => beers.reduce((acc, beer) => acc.then(() => {
      const name = beer.dataValues.breweryName;
      console.log(`Creating brewery ${name} for beer ${beer.name}...`);
      return db.Brewery.findOrCreate({
        where: {
          name,
        },
        defaults: {
          name,
        },
      })
      .then(([breweryModel]) => breweryModel)
      .then((breweryModel) => {
        console.log(`Pointing beer ${beer.name} to brewery #${breweryModel.id}: ${breweryModel.name}...`);
        return beer.update({
          breweryId: breweryModel.id,
        });
      });
    }), Promise.resolve()))
    // and drop the breweryName column from Beers
    .then(() => queryInterface.removeColumn('Beers', 'breweryName'));
  },

  down(queryInterface, DataTypes) {
    return queryInterface.addColumn('Beers', 'breweryName', {
      type: DataTypes.STRING,
    })
    .then(() => db.Beer.findAll({
      include: db.Brewery,
    }))
    .then(beers => beers.reduce((acc, beer) => acc.then(() => {
      const breweryName = beer.Brewery.name;
      console.log(`Normalising Brewery ${breweryName} back on to beer ${beer.name}...`);

      // because .breweryName was removed from the model definition in models/beer.js
      // we need to execute this query manually, can't use beer.update()
      return queryInterface.sequelize.query(`UPDATE Beers SET breweryName="${breweryName}" WHERE id=${beer.id};`);
    }), Promise.resolve())
    .then(() => queryInterface.dropTable('Breweries'))
    .then(() => queryInterface.removeColumn('Beers', 'breweryId')));
  },
};
