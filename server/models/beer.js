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
    onDelete: 'CASCADE', // delete brewery => delete beers
    onUpdate: 'CASCADE', // update brewery.id => cascade
  },
  abv: DataTypes.FLOAT,
  ibu: DataTypes.FLOAT,
  variety: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
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
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
});
