'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('penalties', [
      {
        id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        userId: '44444444-4444-4444-4444-444444444444',
        loanId: 'ccccccc3-cccc-cccc-cccc-cccccccccccc',
        policyId: '11111111-1111-1111-1111-111111111111',
        amount: 50.0,
        paymentMethod: 'Cash',
        type: 'DISCIPLINARY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        userId: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        loanId: 'ddddddd4-dddd-dddd-dddd-dddddddddddd',
        policyId: '22222222-2222-2222-2222-222222222222',
        amount: 100.0,
        paymentMethod: 'Mobile Money',
        type: 'LOAN_OVERDUE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ccccccc3-cccc-cccc-cccc-cccccccccccc',
        userId: 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        loanId: 'ccccccc3-cccc-cccc-cccc-cccccccccccc',
        policyId: '33333333-3333-3333-3333-333333333333',
        amount: 75.0,
        paymentMethod: 'Bank Transfer',
        type: 'DISCIPLINARY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('penalties', null, {});
  },
};
