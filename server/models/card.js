/**
 * Card model.
 * An NFC token belonging to a User.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Card', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE', // delete user => delete card
    onUpdate: 'CASCADE', // change user.id => update card
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
});
