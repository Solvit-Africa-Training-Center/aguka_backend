import { Sequelize } from 'sequelize';
import { User, UserModel } from './userModel';
import { Group, GroupModel } from './groupModel';
import { Contribution, ContributionModel } from './contributionModel';
import { Loan, LoanModel } from './loan';

interface Modals {
  User: typeof User;
  Group: typeof Group;
  Contribution: typeof Contribution;
}

export const AllModal = (sequelize: Sequelize) => {
  const models = {
    User: UserModel(sequelize),
    Group: GroupModel(sequelize),
    Contribution: ContributionModel(sequelize),
    Loan: LoanModel(sequelize),
  };

  // Set up associations
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};
