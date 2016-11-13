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
  Sequelize,
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

// keg <-> tap
db.Keg.hasOne(db.Tap, {
  foreignKey: 'kegId',
});
db.Tap.belongsTo(db.Keg, {
  foreignKey: 'kegId',
});

// kegs have ratings
db.Keg.hasMany(db.Rating, {
  foreignKey: 'kegId',
});

// ratings have users
db.User.hasOne(db.Rating, {
  foreignKey: 'userId',
});
db.Rating.belongsTo(db.User, {
  foreignKey: 'userId',
});

sequelize.sync().then(() => {
  logger.info('sequelize db synced');
});


module.exports = db;
