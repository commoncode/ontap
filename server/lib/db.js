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
  onDelete: 'SET NULL', // delete Keg => set Tap.kegId to null
});
db.Tap.belongsTo(db.Keg, {
  foreignKey: 'kegId',
});

// A Keg has a Beer
db.Beer.hasMany(db.Keg, {
  foreignKey: 'beerId',
  onDelete: 'CASCADE', // can't delete a beer that has kegs
});
db.Keg.belongsTo(db.Beer, {
  foreignKey: 'beerId',
});

// A Beer has a Brewery
db.Brewery.hasMany(db.Beer, {
  foreignKey: 'breweryId',
  onDelete: 'CASCADE', // delete brewery => delete beers
});
db.Beer.belongsTo(db.Brewery, {
  foreignKey: 'breweryId',
});

// A Card has a User
db.User.hasMany(db.Card, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', // delete user => delete cards
});
db.Card.belongsTo(db.User, {
  foreignKey: 'userId',
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
  onDelete: 'CASCADE', // delete keg => delete Cheers
});
db.Cheers.belongsTo(db.Keg, {
  foreignKey: 'kegId',
});

// Cheers have Users
db.User.hasMany(db.Cheers, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', // delete user => delete Cheers
});
db.Cheers.belongsTo(db.User, {
  foreignKey: 'userId',
});


// Touches have Card, Cheers and Keg.
// Note constraints: false means they're not FKs in the schema,
// Sequelize just lets us act like they are.
db.Touch.belongsTo(db.Cheers, {
  foreignKey: 'cheersId',
  constraints: false,
});

db.Touch.belongsTo(db.Keg, {
  foreignKey: 'kegId',
  constraints: false,
});

db.Touch.belongsTo(db.Card, {
  foreignKey: 'cardId',
  constraints: false,
});


module.exports = db;
