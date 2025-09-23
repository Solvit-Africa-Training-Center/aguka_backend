'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'LOAN_INTEREST' to the enum type for penaltyPolicy.type
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_penaltyPolicy_type'
        ) THEN
          -- Enum does not exist, nothing to do
          RETURN;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum WHERE enumlabel = 'LOAN_INTEREST' AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'enum_penaltyPolicy_type'
          )
        ) THEN
          ALTER TYPE "enum_penaltyPolicy_type" ADD VALUE 'LOAN_INTEREST';
        END IF;
      END
      $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Cannot remove enum values in PostgreSQL, so just leave as is
    return Promise.resolve();
  },
};
