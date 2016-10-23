/**
 * Tap model.
 * Represents a physical tap.
 * Just has a name and (optionally) points at a keg.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Tap', {
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
  kegId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Kegs',
      key: 'id',
    },
    unique: true,
    allowNull: true,
  }
});
