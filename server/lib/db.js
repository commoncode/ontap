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
  host: process.env.DB_HOST,
  database: 'ontap',
  username: null,
  password: null,
  dialect: 'sqlite',
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

sequelize.sync().then(() => {
  logger.info('sequelize db synced');
});

module.exports = db;
