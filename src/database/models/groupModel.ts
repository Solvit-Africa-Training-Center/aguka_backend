import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { User } from './userModel';
import { Contribution } from './contributionModel';

export interface GroupAttributes {
  id: string; // 6-character group code
  name: string;
  description: string;
  location: string[];
  profilePicture?: string;
  meetingLocation?: string;
  interestRate?: number;
  contact?: string;
  email?: string;
  minContribution: number;
  agreementTerms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Group
  extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public location!: string[];
  public profilePicture?: string;
  public meetingLocation?: string;
  public interestRate?: number;
  public contact?: string;
  public email?: string;
  public minContribution!: number;
  public agreementTerms?: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: { User: typeof User; Contribution: typeof Contribution }): void {
    Group.hasMany(models.User, { foreignKey: 'groupId', as: 'users' });
    Group.hasMany(models.Contribution, { foreignKey: 'groupId', as: 'contributions' });
  }

  public toJSON(): GroupAttributes {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      location: this.location,
      profilePicture: this.profilePicture,
      meetingLocation: this.meetingLocation,
      interestRate: this.interestRate,
      contact: this.contact,
      email: this.email,
      minContribution: this.minContribution,
      agreementTerms: this.agreementTerms,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const GroupModel = (sequelize: Sequelize): typeof Group => {
  Group.init(
    {
      id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meetingLocation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interestRate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      minContribution: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      agreementTerms: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: 'groups',
    },
  );

  return Group;
};
