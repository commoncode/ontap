/**
 * rating model.
 * users can rate a keg.
 * thumbs up, thumbs down, thumbs none.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Cheers', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  kegId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Kegs',
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
