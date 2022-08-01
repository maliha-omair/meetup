'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memberships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id'
        },
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: {
            tableName: 'Groups',
          },
          key: 'id'
        },
      },
      status: {
        type: Sequelize.ENUM('co-host','pending','member')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Memberships');
  }
};