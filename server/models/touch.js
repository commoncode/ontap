/**
 * Touch model.
 * Sent from TapOnTap when someone taps their Card on the reader.
 *
 * kegId, cardId & cheersId aren't proper FKs!
 * They can all point to nothing.
 * At this stage, we'll just ignore that. In the future we *might* delete them.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Touch', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  cardUid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  kegId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cheersId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
