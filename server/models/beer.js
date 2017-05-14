/**
 * Beer model.
 * Created by a Brewery, placed into a Keg and then consumed via a Tap.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Beer', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breweryId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Breweries',
      key: 'id',
    },
    allowNull: false,
    onDelete: 'cascade', // delete brewery, delete beers
  },
  abv: DataTypes.FLOAT,
  ibu: DataTypes.FLOAT,
  variety: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: DataTypes.STRING,
  canBuy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  addedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: true,
  },
});
