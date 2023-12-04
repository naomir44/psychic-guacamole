'use strict';
const { Op } = require('sequelize');
const { reviewImage, Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   options.tableName = 'reviewImages';
   await reviewImage.bulkCreate(options, [
    {
      reviewId: 1,
      url: 'http://www.example.com/'
    },
    {
      reviewId: 2,
      url: 'http://www.exampleReview.com/'
    },
    {
      reviewId: 3,
      url: 'http://www.Anotherexample.com/'
    }
   ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
   options.tableName = 'reviewImages';
   const Op = Sequelize.Op;
   return queryInterface.bulkDelete(options, {
    url: { [Op.in]: ['http://www.example.com/','http://www.exampleReview.com/', 'http://www.Anotherexample.com/' ] }
   }, {})
  }
};
