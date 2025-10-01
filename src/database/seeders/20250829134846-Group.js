'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('groups', null, {});
    await queryInterface.bulkInsert('groups', [
      {
        id: 'ABC123',
        name: 'Aguka Test Group',
        description: 'Dummy group for testing',
        location: ['Kigali', 'Rwanda'],
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/sample.png',
        meetingLocation: 'Ndera Hall',
        interestRate: 5.7,
        contact: '078880000',
        email: 'group@example.com',
        minContribution: 500,
        agreementTerms: 'https://res.cloudinary.com/demo/raw/upload/agreement.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('groups', { name: 'Aguka Test Group' });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
