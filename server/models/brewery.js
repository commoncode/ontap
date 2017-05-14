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
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adminNotes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  canBuy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  tableName: 'Breweries',
});
