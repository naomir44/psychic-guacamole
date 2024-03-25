'use strict';
const { Model } = require('sequelize');
const database = require('../../config/database');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.hasMany(
        models.reviewImage,
        { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true }
      )
      Review.belongsTo(models.User, { foreignKey: 'userId'})
      Review.belongsTo(models.Spot, { foreignKey: 'spotId'})
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
