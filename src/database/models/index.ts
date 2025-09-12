import { Sequelize } from 'sequelize';
import { User, UserModel } from './user';
import { Loan, LoanModel } from './loan';
import { Group, GroupModel } from './group';

interface Modals{
    User: typeof User;
    Loan: typeof Loan;
    Group: typeof Group;
}



export const AllModal = (sequelize: Sequelize) => ({
  
    User: UserModel(sequelize),
    Loan: LoanModel(sequelize),
    Group: GroupModel(sequelize)
});
