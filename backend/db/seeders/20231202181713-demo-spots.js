'use strict';
const { Spot, User, Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await Spot.bulkCreate(options,
    [
      {
        ownerId: 1,
        address: '5234 e Carlisle',
        city: 'Albuquerque',
        state: 'New Mexico',
        country: 'United States of America',
        lat: 58.487370474635,
        lng: -10.8544921875,
        name: 'Abq house',
        description: 'In da ghetto',
        price: '134.00'
      },
      {
        ownerId: 2,
        address: '1782 W Poe',
        city: 'Roswell',
        state: 'New Mexico',
        country: 'United States of America',
        lat: 98.4873704748694,
        lng: -11.8544921875,
        name: 'Alien Themed Casa',
        description: 'This house is said to be built right next to the crash landing',
        price: '250.00'
      },
      {
        ownerId: 3,
        address: '954 N Peach rd',
        city: 'Tucumcari',
        state: 'New Mexico',
        country: 'United States of America',
        lat: 32.487370474635,
        lng: -9.8544921875,
        name: 'Route 66',
        description: 'Based on the Cars movie and Route 66',
        price: '150.00'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
  options.tableName = 'Spots';
  const Op = Sequelize.Op;
return queryInterface.bulkDelete(options, {
name: { [Op.in]: ['Abq House', 'Alien Themed House', 'Route 66'] }
}, {});
  }
};
