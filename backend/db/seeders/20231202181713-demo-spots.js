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
    await Spot.bulkCreate(//options,
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
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 32.487370474635,
        lng: -9.8544921875,
        name: 'Lux',
        description: 'Nestled in the vibrant heart of Los Angeles, this stunning modern home offers a blend of luxury and contemporary design. The exterior is characterized by sleek, clean lines and large glass panels that flood the interior with natural light, accentuating the open-plan layout. The facade is complemented by a harmonious mix of concrete, wood, and steel elements, creating a visually striking appearance.',
        price: '350.00'
      },
      {
        ownerId: 1,
        address: '1245 Little Bear rd',
        city: 'Colorado Springs',
        state: 'Colorado',
        country: 'United States of America',
        lat: 45.4873,
        lng: 10.8544921875,
        name: 'Tiny Cabin',
        description: "Spending vacation in this tiny cabin on wheels might be a dream for many. The 400 square foot cabin has all the features of a modern recreational vehicle. Rent The Wedge and get inspired before building one." ,
        price: '125.00'
      },
      {
        ownerId: 2,
        address: "5678 Malibu dr",
        city: "Florida Keys",
        state: "Florida",
        country: 'United States of America',
        lat: 45.4873,
        lng: 10.8544921875,
        name: "Beach House",
        description: "The house is located in the enclave of Llandudno Beach, a locals-only spot with unspoilt, fine white sand and curling surfing waves. Although shops and restaurants are only a five-minute drive away, the area feels peaceful and secluded.",
        price: "100.00"
      },
      {
        ownerId: 3,
        address: '8910 Mountain Way Rd',
        city: 'Pocatello',
        state: 'Idaho',
        country: 'United States of America',
        lat: 32.487370474635,
        lng: -9.8544921875,
        name: 'Cabin In The Woods',
        description: 'Pretend you are lost in a magical forest as you perch on a log or curl up in the swinging chair. Soak in the tub, then fall asleep in a heavenly bedroom with cloud-painted walls and twinkling lights. And when you wake up, the espresso machine awaits.',
        price: '168.00'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
  options.tableName = 'Spots';
  const Op = Sequelize.Op;
return queryInterface.bulkDelete(options, {
name: { [Op.in]: ['Abq House', 'Alien Themed House', 'Route 66', 'Tiny Cabin', 'Beach House', 'Cabin In The Woods'] }
}, {});
  }
};
