'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.createTable('users', { 
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
            },
            name: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            email: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
            },
            phoneNumber: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
            },
            password: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            role: {
              type: Sequelize.ENUM('admin', 'president', 'secretary', 'treasurer', 'user'),
              allowNull: false,
              defaultValue: 'user',
            },
            googleId: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            provider: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            groupId: {
              type: Sequelize.UUID,
              allowNull: false,
            },
            createdAt: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
            },
            updatedAt: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
            },
      });

  },

  async down (queryInterface, Sequelize) {
    
  }
};
