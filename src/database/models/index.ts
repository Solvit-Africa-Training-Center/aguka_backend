import { Sequelize } from 'sequelize';
import { User, UserModel } from './userModel';
import { Group, GroupModel } from './groupModel';
import { Contribution, ContributionModel } from './contributionModel';
import { Loan, LoanModel } from './loan';
import { Feed, feedModel } from './feedModel';
import { Comment, commentModel } from './commentModel';
import { Like, likeModel } from './likeModel';

interface Modals {
  User: typeof User;
  Group: typeof Group;
  Contribution: typeof Contribution;
  Feed: typeof Feed;
  Comment: typeof Comment;
  Like: typeof Like;
}

export const AllModal = (sequelize: Sequelize) => {
  const models = {
    User: UserModel(sequelize),
    Group: GroupModel(sequelize),
    Contribution: ContributionModel(sequelize),
    Loan: LoanModel(sequelize),
    Feed: feedModel(sequelize),
    Comment: commentModel(sequelize),
    Like: likeModel(sequelize),
  };

  // Set up associations
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};
