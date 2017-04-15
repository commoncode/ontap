'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.dropTable('Votes'),
  down: (queryInterface, DataTypes) => queryInterface.createTable('Votes', {
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
  })
};
