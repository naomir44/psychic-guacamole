'use strict';
const { Model } = require('sequelize');
const database = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {

    }
  }
  Review.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type:  DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
