'use strict';
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    let users = [];
    for(let i=0; i<10; i++){
        users.push({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          username: faker.internet.userName(),
          hashedPassword: bcrypt.hashSync("secret1")
        });
    }
    await queryInterface.bulkInsert('Users',
      users, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
