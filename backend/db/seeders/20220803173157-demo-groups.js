'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Groups',
      [

        {
          name: 'MCNA Summer Camp',
          organizerId: 5,
          about: 'Join summer camp and help children to explore in fun learning way',
          type: "In person",
          private: true,
          city: "ChesterBrook",
          state: "PA"
        },
        {
          name: 'Relief work',
          organizerId: 2,
          about: 'Join hands with helping hands to help our future (our children)',
          type: "Online",
          private: true,
          city: "Collegeville",
          state: "PA"
        },
        {
          name: 'YMJ Outdoor fun',
          organizerId: 6,
          about: 'Educate you children in fun learning way through YMJ ',
          type: "In person",
          private: false,
          city: "Devon",
          state: "PA"
        },
      ], {});
  },


  async down(queryInterface, Sequelize) {
  
    await queryInterface.bulkDelete('Groups', null, {});
   
}
};
