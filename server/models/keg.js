/**
 * Keg model.
 * Represents a physical keg.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Keg', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  beerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breweryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abv: DataTypes.FLOAT,
  tapped: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  untapped: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: DataTypes.STRING,
});
