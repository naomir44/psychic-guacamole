'use strict';
const { Spot, User, Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
options.tableName = 'Reviews';
await Review.bulkCreate(options, [
{
  spotId: 1,
  userId: 1,
  review: 'this house was alright.',
  stars: 3
},
{
  spotId: 2,
  userId: 2,
  review: 'I love the theme.',
  stars: 4
},
{
spotId: 3,
userId: 3,
review: 'This is the best airbnb!',
stars: 5
}
], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
  return queryInterface.bulkDelete(options, {
  review: { [Op.in]: ['this house was alright.', 'I love the theme.', 'This is the best airbnb!'] }
  }, {});
  }
};
