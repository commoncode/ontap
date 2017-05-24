/**
 * Cheers model.
 * Users can Cheers a keg to indicate they're digging it.
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
    onDelete: 'CASCADE', // delete keg => delete cheers
    onUpdate: 'CASCADE', // change keg.id => update cheers
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE', // delete user => delete cheers
    onUpdate: 'CASCADE', // change user.id => update cheers
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
