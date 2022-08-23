'use strict';

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const {User,Group} = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    let users = [];
    let groups = [];
    let events = [];

    let email = "demo@aa.com";
    let userName = "demouser";
    users.push({
      firstName: "Demo",
      lastName: "User",
      email: email,
      username: userName,
      hashedPassword: bcrypt.hashSync("demouser")
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
      users, {});

    const user = await User.findOne({
      where: {
          userName: userName,
          email: email
      },
    });
  
    let groupName = faker.random.words(3);
    console.log(user.id)
    groups.push({
      name: groupName,
      organizerId: user.id,
      about: faker.lorem.words(70),
      type: "In person",
      private: true,
      city: faker.address.cityName(),
      state: faker.address.state()
    })

    groups.push({
      name: faker.random.words(3),
      organizerId: user.id,
      about: faker.lorem.words(70),
      type: "Online",
      private: false,
      city: faker.address.cityName(),
      state: faker.address.state()
    })
    
    groups.push({
      name: faker.random.words(3),
      organizerId: user.id,
      about: faker.lorem.words(70),
      type: "In person",
      private: false,
      city: faker.address.cityName(),
      state: faker.address.state()
    })

    groups.push({
      name: faker.random.words(3),
      organizerId: user.id,
      about: faker.lorem.words(70),
      type: "Online",
      private: true,
      city: faker.address.cityName(),
      state: faker.address.state()
    })

    groups.push({
      name: faker.random.words(3),
      organizerId: user.id,
      about: faker.lorem.words(70),
      type: "Online",
      private: false,
      city: faker.address.cityName(),
      state: faker.address.state()
    })


    await queryInterface.bulkInsert('Groups',
      groups, {});

    const group = await Group.findOne({
      where: {
          organizerId: user.id
      },
    });
  
    console.log("group's id is ", group.id)
        
    events.push({
      groupId: group.id,
      venueId: null,
      name:  faker.random.words(3),
      description: faker.lorem.words(70),
      type: "In person",
      capacity: 100,
      price: 10.2,
    })

    events.push({
      groupId: group.id,
      venueId: null,
      name:  faker.random.words(3),
      description: faker.lorem.words(70),
      type: "In person",
      capacity: 100,
      price: 10.2,
    })

    events.push({
      groupId: group.id,
      venueId: null,
      name:  faker.random.words(3),
      description: faker.lorem.words(70),
      type: "In person",
      capacity: 100,
      price: 10.2,
    })

    events.push({
      groupId: group.id,
      venueId: null,
      name:  faker.random.words(3),
      description: faker.lorem.words(70),
      type: "In person",
      capacity: 100,
      price: 10.2,
    })

    events.push({
      groupId: group.id,
      venueId: null,
      name:  faker.random.words(3),
      description: faker.lorem.words(70),
      type: "In person",
      capacity: 100,
      price: 10.2,
    })

    await queryInterface.bulkInsert('Events',
      events, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Groups', null, {});
    await queryInterface.bulkDelete('Events', null, {});
  }
};
