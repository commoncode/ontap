/**
 * rating model.
 * users can rate a keg.
 * thumbs up, thumbs down, thumbs none.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kegId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Kegs',
      key: 'id',
    },
    unique: 'kegAndUser', // unique-together
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    unique: 'kegAndUser',
    allowNull: false,
  },
});
