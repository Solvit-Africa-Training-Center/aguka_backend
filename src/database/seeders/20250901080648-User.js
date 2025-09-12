// src/database/seeders/20250901000200-User.js
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
        groupId: '11111111-1111-1111-1111-111111111111', // must match group
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Normal User',
        email: 'user@example.com',
        phoneNumber: '0789999999',
        password: hashedPassword,
        role: 'treasurer',
        groupId: '22222222-2222-2222-2222-222222222222', // must match group
        createdAt: new Date(),
        updatedAt: new Date(),
      },
       {
        id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        name: "Alice Johnson",
        email: "alice@example.com",
        phoneNumber: "0781111111",
        password: hashedPassword,
        role: 'president',
        groupId: "11111111-1111-1111-1111-111111111111", 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        name: "Bob Smith",
        email: "bob@example.com",
        phoneNumber: "0782222222",
        password: hashedPassword,
        role: 'user',
        groupId: "22222222-2222-2222-2222-222222222222", 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
      ignoreDuplicates: true
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
