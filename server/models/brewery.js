/**
 * Brewery model.
 * Breweries produce Beers.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Brewery', {
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
  location: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  web: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  adminNotes: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  canBuy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  freezeTableName: true,
  tableName: 'Breweries',
});
