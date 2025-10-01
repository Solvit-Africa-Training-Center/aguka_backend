'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('loans', [
      {
        id: 'ccccccc3-cccc-cccc-cccc-cccccccccccc',
        userId: '44444444-4444-4444-4444-444444444444', // Alice
        amount: 100000,
        interestRate: 10,
        totalPayable: 110000, // auto-calculated normally
        startDate: new Date('2025-09-01'),
        dueDate: new Date('2026-09-01'),
        durationMonths: 12,
        status: 'PENDING',
        approvedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ddddddd4-dddd-dddd-dddd-dddddddddddd',
        userId: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // Bob
        amount: 200000,
        interestRate: 15,
        totalPayable: 230000,
        startDate: new Date('2025-09-01'),
        dueDate: new Date('2026-03-01'),
        durationMonths: 6,
        status: 'PENDING',
        approvedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loans', {});
  },
};
