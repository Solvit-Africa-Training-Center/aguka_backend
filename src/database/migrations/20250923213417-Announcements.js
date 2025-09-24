'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Announcements', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      authorId: { type: Sequelize.UUID, allowNull: false },
      groupId: { type: Sequelize.STRING(6), allowNull: false },
      meetingDate: { type: Sequelize.DATEONLY, allowNull: false },
      meetingTime: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: false },
      agenda: { type: Sequelize.TEXT, allowNull: false },
      status: {
        type: Sequelize.ENUM('scheduled', 'completed', 'postponed'),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      attendeesCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:*/
    await queryInterface.dropTable('Announcements');
  },
};
