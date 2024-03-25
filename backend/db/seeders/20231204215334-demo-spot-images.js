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
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/abq-house+pool.jpeg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/abqhouse2.jpeg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/abqhouse3.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/alien-house.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/alien-house2.webp',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/alienhouse3.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/carshouse.jpeg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/carhouse2.jpeg',
        preview: false
      },
      // {
      //   spotId: 4,
      //   url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/images-cancun.jpeg',
      //   preview: true
      // },
      // {
      //   spotId: 4,
      //   url: 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/cancun.jpeg',
      //   preview: false
      // }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'spotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://pyschguacbucket.s3.us-west-1.amazonaws.com/abq-house+pool.jpeg', 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/alien-house.jpg', 'https://pyschguacbucket.s3.us-west-1.amazonaws.com/images/carshouse.jpeg'] }
    }, {});
  }
};
