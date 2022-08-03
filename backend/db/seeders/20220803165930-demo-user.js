'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  async up(queryInterface, Sequelize) {
 

    await queryInterface.bulkInsert('Users',
      [

        {

          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          username: "jonedoe",
          hashedPassword: bcrypt.hashSync("secret1")
        },
        {
          firstName: 'Samina',
          lastName: 'Shahid',
          email: 'samina_shahid@gmail.com',
          username: "saminashahid",
          hashedPassword: bcrypt.hashSync("secret2")
        },
        {
          firstName: 'Carole',
          lastName: 'Blunt',
          email: 'carole_blunt@gmail.com',
          username: "caroleblunt",
          hashedPassword: bcrypt.hashSync("secret3")
        },
        {
          firstName: 'Hafsa',
          lastName: 'Bilal',
          email: 'hafsa_bilal@gmail.com',
          username: "hafsabilal",
          hashedPassword: bcrypt.hashSync("secret4")
        },
        {
          firstName: 'Mariam',
          lastName: 'Amir',
          email: 'mariam_amir@gmail.com',
          username: "mariamamir",
          hashedPassword: bcrypt.hashSync("secret5")
        },
        {
          firstName: 'Saba',
          lastName: 'Rehbar',
          email: 'saba_rehbar@gmail.com',
          username: "sabarehbar",
          hashedPassword: bcrypt.hashSync("secret6")
        },
      ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
