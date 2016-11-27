/**
 * vote model.
 * users can vote for a beer.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  beerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Beers',
      key: 'id',
    },
    unique: 'beerAndUser', // unique-together
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    unique: 'beerAndUser',
    allowNull: false,
  },
});
