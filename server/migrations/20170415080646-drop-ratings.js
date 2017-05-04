/**
 * Drop the Ratings table.
 */

'use strict';

module.exports = {
  up: queryInterface => queryInterface.dropTable('Ratings'),
  down: (queryInterface, DataTypes) => queryInterface.createTable('Ratings', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: -1,
        max: 1,
      },
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
  }),
};
