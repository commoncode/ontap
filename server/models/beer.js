/**
 * beer model.
 * represents a beer that's on tap.
 * so more like a keg, technically.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Beer', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  tapName: DataTypes.STRING,
  beerName: DataTypes.STRING,
  breweryName: DataTypes.STRING,
  abv: DataTypes.FLOAT,
  tapped: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  notes: DataTypes.STRING,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
