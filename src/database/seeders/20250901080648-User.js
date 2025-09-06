// src/database/seeders/20250901080648-User.js
'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Admin User',
        email: 'admin@example.com',
        phoneNumber: '0788888888',
        password: hashedPassword,
        role: 'admin',
        groupId: null,
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Normal User',
        email: 'user@example.com',
        phoneNumber: '0789999999',
        password: hashedPassword,
        role: 'user',
        groupId: 'ABC123',
        isApproved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
