import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { User } from './userModel';
import { Group } from './groupModel';

export interface ContributionAttributes {
  id: string;
  userId: string;
  groupId: string; // 6-character group code
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'momo';
  contributionDate: Date;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ContributionCreationAttributes
  extends Optional<ContributionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export class Contribution
  extends Model<ContributionAttributes, ContributionCreationAttributes>
  implements ContributionAttributes
{
  public id!: string;
  public userId!: string;
  public groupId!: string;
  public amount!: number;
  public paymentMethod!: 'cash' | 'bank' | 'momo';
  public contributionDate!: Date;
  public recordedBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  static associate(models: { User: typeof User; Group: typeof Group }) {
    Contribution.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Contribution.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
  }
}

export const ContributionModel = (sequelize: Sequelize): typeof Contribution => {
  Contribution.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'bank', 'momo'),
        allowNull: false,
      },
      contributionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      recordedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'contributions',
      paranoid: true,
    },
  );

  return Contribution;
};
