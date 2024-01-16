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
   Spot.hasMany(
    models.Booking,
    { foreignKey: 'spotId', onDelete: 'CASCADE' }
   )
   Spot.hasMany(
    models.spotImage,
    { foreignKey: 'spotId', onDelete: 'CASCADE'}
   )
   Spot.belongsTo(models.User, { as: "Owner", foreignKey: 'ownerId' })
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    city: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    state: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    country:{
      type:  DataTypes.STRING,
      allowNull: false
    },
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    description:{
      type: DataTypes.STRING,
      allowNull: false
    },
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
