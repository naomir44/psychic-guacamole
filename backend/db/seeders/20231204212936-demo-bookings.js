'use strict';
const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-05-05',
        endDate: '2023-05-08'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-07-16',
        endDate: '2023-07-23'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023-12-23',
        endDate: '2023-12-27'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      endDate: { [Op.in]: ['2023-05-08', '2023-07-23', '2023-12-27'] }
    }, {});
  }
};
