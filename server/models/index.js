/**
 * models.
 *
 * imports sequelize models, exports them onto a
 * single object for use throughout the app.
 */


const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const logger = require('lib/logger');

const sequelize = new Sequelize(null, null, null, {
  host: 'ontap.sqlite',
  database: 'ontap',
  username: null,
  password: null,
  dialect: 'sqlite',
});

const db = {
  sequelize,
  Sequelize,
};

const thisFilename = path.basename(module.filename);

// import models from the modules in this directory.
const loadModels = () => {
  fs.readdirSync(__dirname)
  .filter(file =>
    // exclude hidden files and this file.
    file[0] !== '.' && file !== thisFilename
  ).forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
};

loadModels();

sequelize.sync().then(() => {
  logger.info('sequelize db synced');
});

module.exports = db;
