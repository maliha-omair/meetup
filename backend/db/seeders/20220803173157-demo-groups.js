'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    let groups = [];
    for(let i=0; i<5; i++){
      groups.push({
        name: faker.random.words(3),
        organizerId: 5,
        about: faker.lorem.words(70),
        type: i%2===0?"In person":"Online",
        private: true,
        city: faker.address.cityName(),
        state: faker.address.state()
      })
    }
    await queryInterface.bulkInsert('Groups',groups, {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});   
}
};
