/**
 * Keg model.
 * Represents a physical keg.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Keg', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  tapped: {
    type: DataTypes.DATE,
    allowNull: true,
    // return null if that's what's in the db.
    // otherwise sequelize coerces to an invalid date for some
    // dumb reason. possibly sqlite only, i don't know.
    get: function getTapped() {
      const dataValue = this.dataValues.tapped;
      if (dataValue && dataValue.getDate && !isNaN(dataValue.getDate())) {
        return dataValue;
      }
      return null;
    },
  },
  untapped: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  beerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Beers',
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE', // delete beer => delete keg
    onUpdate: 'CASCADE', // change beer.id => update keg
  },
});
