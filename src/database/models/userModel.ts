import { Model, DataTypes, Optional, Sequelize, ModelStatic } from 'sequelize';
import { Group } from './groupModel';
import { Contribution } from './contributionModel';

export interface UserAttributes {
  id: string;
  name?: string; //  optional for Google users
  email: string;
  phoneNumber?: string | null;
  password?: string | null;
  role: 'admin' | 'president' | 'secretary' | 'treasurer' | 'user';
  googleId?: string;
  provider?: string;
  groupId?: string | null; // 6-character group code
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'phoneNumber'
    | 'password'
    | 'googleId'
    | 'provider'
    | 'groupId'
    | 'isApproved'
  > {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name?: string;
  public email!: string;
  public phoneNumber?: string;
  public password?: string;
  public role!: 'admin' | 'president' | 'secretary' | 'treasurer' | 'user';
  public googleId?: string;
  public provider?: string;
  public groupId?: string;
  public isApproved!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
  profilePicture: any;

  static associate(models: { Group: typeof Group; Contribution: typeof Contribution }): void {
    User.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
    });
    User.hasMany(models.Contribution, {
      foreignKey: 'userId',
      as: 'contributions',
    });
  }
}

export const UserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'president', 'secretary', 'treasurer', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      groupId: {
        type: DataTypes.STRING(6),
        allowNull: true,
        references: { model: 'groups', key: 'id' },
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'users',
    },
  );

  return User;
};
