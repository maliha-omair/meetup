'use strict';

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const {User,Group} = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {

    
    const t = await queryInterface.sequelize.transaction({autocommit:false});
    try{
      let users = [];
      let groups = [];
      let events = [];

      let email = "demo123@aa.com";
      let username = "demouser123";
      users.push({
        firstName: "Demo123",
        lastName: "User123",
        email: email,
        username: username,
        hashedPassword: bcrypt.hashSync("demouser123")
      });
      
      users.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync("secret1")
      })

      users.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync("secret1")
      })

      await queryInterface.bulkInsert('Users',
        users, { transaction: t });

      const user = await User.findOne({
        where: {
            username: username,
            email: email
        },  transaction: t
      } );
    
      let groupName = faker.random.words(3);
      groups.push({
        name: groupName,
        organizerId: user.id,
        about: faker.lorem.words(70).substring(0,254),
        type: "In person",
        private: true,
        city: faker.address.cityName(),
        state: faker.address.state()
      })

      groups.push({
        name: faker.random.words(3),
        organizerId: user.id,
        about: faker.lorem.words(70).substring(0,254),
        type: "Online",
        private: false,
        city: faker.address.cityName(),
        state: faker.address.state()
      })
      
      groups.push({
        name: faker.random.words(3),
        organizerId: user.id,
        about: faker.lorem.words(70).substring(0,254),
        type: "In person",
        private: false,
        city: faker.address.cityName(),
        state: faker.address.state()
      })

      groups.push({
        name: faker.random.words(3),
        organizerId: user.id,
        about: faker.lorem.words(70).substring(0,254),
        type: "Online",
        private: true,
        city: faker.address.cityName(),
        state: faker.address.state()
      })

      groups.push({
        name: faker.random.words(3),
        organizerId: user.id,
        about: faker.lorem.words(70).substring(0,254),
        type: "Online",
        private: false,
        city: faker.address.cityName(),
        state: faker.address.state()
      })


      await queryInterface.bulkInsert('Groups',
        groups, { transaction: t });

      const group = await Group.findOne({
        where: {
            organizerId: user.id
        },  transaction: t 
      });
    
    
          
      events.push({
        groupId: group.id,
        venueId: null,
        name:  faker.random.words(3),
        description: faker.lorem.words(70).substring(0,254),
        type: "In person",
        capacity: 100,
        price: 10.2,
      })

      events.push({
        groupId: group.id,
        venueId: null,
        name:  faker.random.words(3),
        description: faker.lorem.words(70).substring(0,254),
        type: "In person",
        capacity: 100,
        price: 10.2,
      })

      events.push({
        groupId: group.id,
        venueId: null,
        name:  faker.random.words(3),
        description: faker.lorem.words(70).substring(0,254),
        type: "In person",
        capacity: 100,
        price: 10.2,
      })

      events.push({
        groupId: group.id,
        venueId: null,
        name:  faker.random.words(3),
        description: faker.lorem.words(70).substring(0,254),
        type: "In person",
        capacity: 100,
        price: 10.2,
      })

      events.push({
        groupId: group.id,
        venueId: null,
        name:  faker.random.words(3),
        description: faker.lorem.words(70).substring(0,254),
        type: "In person",
        capacity: 100,
        price: 10.2,
      })

      await queryInterface.bulkInsert('Events',
        events, { transaction: t });
      await t.commit();
    }catch(error){
      await t.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {});
    await queryInterface.bulkDelete('Groups', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
