/**
 * models.
 *
 * imports sequelize models from the /models directory,
 * exports them on a single object for use throughout the app.
 */


const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const logger = require('lib/logger');

const sequelize = new Sequelize(null, null, null, {
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_STORAGE,
  logging: logger.debug,
});

const db = {
  sequelize,
};

// import our model files
const modelsPath = path.join(__dirname, '/../models');
const loadModels = () => {
  fs.readdirSync(modelsPath)
  .filter(file =>
    // exclude hidden files
    file[0] !== '.'
  ).forEach((file) => {
    const model = sequelize.import(path.join(modelsPath, file));
    db[model.name] = model;
  });
};

loadModels();

// A Tap has a Keg
db.Keg.hasOne(db.Tap, {
  foreignKey: 'kegId',
});
db.Tap.belongsTo(db.Keg, {
  foreignKey: 'kegId',
});

// A Keg has a Beer
db.Beer.hasMany(db.Keg, {
  foreignKey: 'beerId',
  onDelete: 'CASCADE', // delete the beer, delete the kegs
});
db.Keg.belongsTo(db.Beer, {
  foreignKey: 'beerId',
});

// A Beer has a Brewery
db.Brewery.hasMany(db.Beer, {
  foreignKey: 'breweryId',
  onDelete: 'CASCADE', // delete the brewery, delete the beers
});
db.Beer.belongsTo(db.Brewery, {
  foreignKey: 'breweryId',
});

// A Beer is added by a User
db.User.hasOne(db.Beer, {
  foreignKey: 'addedBy',
  as: 'addedByUser',
});
db.Beer.belongsTo(db.User, {
  foreignKey: 'addedBy',
  as: 'addedByUser',
});

// Kegs have Cheers
db.Keg.hasMany(db.Cheers, {
  foreignKey: 'kegId',
});
db.Cheers.belongsTo(db.Keg, {
  foreignKey: 'kegId',
});

// Cheers have Users
db.User.hasMany(db.Cheers, {
  foreignKey: 'userId',
});
db.Cheers.belongsTo(db.User, {
  foreignKey: 'userId',
});

module.exports = db;
