import { Sequelize } from 'sequelize';
import { User, UserModel } from './user';

interface Modals{
    User: typeof User;
}



export const AllModal = (sequelize: Sequelize) => ({
  
    User: UserModel(sequelize)
});
