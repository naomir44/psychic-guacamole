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
    await spotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://amount.example.jpg/',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://amount.picture.jpg/',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://picture.example.org/',
        preview: true
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'spotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://amount.example.jpg/', 'https://amount.picture.jpg/', 'https://picture.example.org/'] }
    }, {});
  }
};
