'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('groups', [
       {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Developers',
        description: 'A group for all developers in the community',
        location: ['Kigali', 'Rwanda'], 
        faq: 'This is a test group for seeding users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Designers',
        description: 'A group for designers to collaborate on UI/UX.',
        location: ['Musanze'],
        faq: 'FAQ about this group.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
      ignoreDuplicates: true
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groups', null, {});
  },
};
