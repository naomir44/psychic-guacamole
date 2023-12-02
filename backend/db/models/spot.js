'use strict';
const { Model } = require('sequelize');
const database = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
   Spot.hasMany(
    models.Review,
    { foreignKey: 'spotId', onDelete: 'CASCADE' }
   )
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false
    },
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
