'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('penaltyPolicy', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        type: 'LOAN_OVERDUE',
        rate: 0.02,
        frequency: 'DAILY',
        gracePeriodDays: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        type: 'DISCIPLINARY',
        rate: 0.1,
        frequency: 'MONTHLY',
        gracePeriodDays: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        type: 'LOAN_INTEREST',
        rate: 0.05,
        frequency: 'MONTHLY',
        gracePeriodDays: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('penaltyPolicy', null, {});
  },
};
