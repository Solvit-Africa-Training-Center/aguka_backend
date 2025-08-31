'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('group', { 
      id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
            },
            name: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            description: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            location: {
              type: Sequelize.ARRAY(Sequelize.STRING),
              allowNull: false,
            },
            faq: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            creationDate: {
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
    
    await queryInterface.dropTable('group');
    
  }
};
