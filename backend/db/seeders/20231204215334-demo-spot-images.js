'use strict';
const { spotImage, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'spotImages';
    await spotImage.bulkCreate(//options,
    [
      {
        spotId: 1,
        url: '/images/abqhouse.jpeg',
        preview: true
      },
      {
        spotId: 2,
        url: '/images/alien-house.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'images/carhouse.jpeg',
        preview: true
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'spotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['abqhouse.jpeg', 'alien-house.jpg', 'carhouse.jpeg'] }
    }, {});
  }
};
