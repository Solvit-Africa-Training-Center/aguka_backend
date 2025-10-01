'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('contributions', [
      {
        id: '55555555-5555-5555-5555-555555555555',
        userId: '44444444-4444-4444-4444-444444444444',
        groupId: 'ABC123',
        amount: 1000,
        paymentMethod: 'cash',
        contributionDate: new Date(),
        recordedBy: '33333333-3333-3333-3333-333333333333',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('contributions', null, {});
  },
};
