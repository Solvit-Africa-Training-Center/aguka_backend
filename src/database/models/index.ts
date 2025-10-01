import { Sequelize } from 'sequelize';
import { User, UserModel } from './userModel';
import { Group, GroupModel } from './groupModel';
import { Contribution, ContributionModel } from './contributionModel';
import { Loan, LoanModel } from './loan';
import { Feed, feedModel } from './feedModel';
import { Comment, commentModel } from './commentModel';
import { Like, likeModel } from './likeModel';
import { Repayment, RepaymentModel } from './repaymentModel';
import { Penalty, PenaltyModel } from './penaltyModel';
import PenaltyPolicy, { PenaltyPolicyModel } from './penaltyPolicy';
import { Announcement, announcementModel } from './announcementModel';

interface Modals {
  User: typeof User;
  Group: typeof Group;
  Contribution: typeof Contribution;
  Feed: typeof Feed;
  Comment: typeof Comment;
  Like: typeof Like;
  Loan: typeof Loan;
  Repayment: typeof Repayment;
  Penalty: typeof Penalty;
  PenaltyPolicy: typeof PenaltyPolicy;
  Announcement: typeof Announcement;
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
    Penalty: PenaltyModel(sequelize),
    PenaltyPolicy: PenaltyPolicyModel(sequelize),
    Repayment: RepaymentModel(sequelize),
    Policy: PenaltyPolicyModel(sequelize), // Add Policy for Penalty associations
    Announcement: announcementModel(sequelize),
  };

  // Set up associations
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};
