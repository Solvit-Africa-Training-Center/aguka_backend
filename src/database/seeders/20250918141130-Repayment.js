'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('repayments', [
      {
        id: '11111111-aaaa-bbbb-cccc-111111111111',
        loanId: 'ccccccc3-cccc-cccc-cccc-cccccccccccc', // Loan 1
        userId: '44444444-4444-4444-4444-444444444444', // Normal User
        amount: 200.0,
        paymentDate: new Date('2025-09-01T10:00:00Z'),
        status: 'PAID',
        remainingBalance: 800.0,
        penaltyAmount: 0.0,
        paymentMethod: 'Cash',
        createdAt: new Date('2025-09-01T10:00:00Z'),
        updatedAt: new Date('2025-09-01T10:00:00Z'),
      },
      {
        id: '22222222-aaaa-bbbb-cccc-222222222222',
        loanId: 'ccccccc3-cccc-cccc-cccc-cccccccccccc', // Loan 1 again
        userId: '44444444-4444-4444-4444-444444444444', // Normal User again
        amount: 300.0,
        paymentDate: new Date('2025-09-15T14:30:00Z'),
        status: 'LATE',
        remainingBalance: 500.0,
        penaltyAmount: 50.0, // penalty because overdue
        paymentMethod: 'Mobile Money',
        createdAt: new Date('2025-09-15T14:30:00Z'),
        updatedAt: new Date('2025-09-15T14:30:00Z'),
      },
      {
        id: '33333333-aaaa-bbbb-cccc-333333333333',
        loanId: 'ddddddd4-dddd-dddd-dddd-dddddddddddd', // Loan 2
        userId: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // Alice Johnson
        amount: 1000.0,
        paymentDate: new Date('2025-09-10T09:15:00Z'),
        status: 'PAID',
        remainingBalance: 0.0,
        penaltyAmount: 0.0,
        paymentMethod: 'Bank Transfer',
        createdAt: new Date('2025-09-10T09:15:00Z'),
        updatedAt: new Date('2025-09-10T09:15:00Z'),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('repayments');
  },
};
