'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'PAID' to the enum_loans_status type in PostgreSQL
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_loans_status" ADD VALUE IF NOT EXISTS 'PAID';`,
    );
  },

  async down(queryInterface, Sequelize) {
    // Cannot remove enum values in PostgreSQL easily, so document this
    // If you need to revert, you must recreate the enum type manually
  },
};
