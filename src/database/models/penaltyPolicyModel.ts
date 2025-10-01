import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from 'sequelize';

interface PenaltyPolicyAttributes {
  id: string;
  type: 'LOAN_OVERDUE' | 'DISCIPLINARY';
  rate: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
  gracePeriodDays: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PenaltyPolicyCreationAttributes
  extends Optional<PenaltyPolicyAttributes, 'id' | 'gracePeriodDays'> {}

export class PenaltyPolicy
  extends Model<PenaltyPolicyAttributes, PenaltyPolicyCreationAttributes>
  implements PenaltyPolicyAttributes
{
  public id!: string;
  public type!: 'LOAN_OVERDUE' | 'DISCIPLINARY';
  public rate!: number;
  public frequency!: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY';
  public gracePeriodDays!: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static associate() {}
}

export const PenaltyPolicyModel = (sequelize: sequelize.Sequelize): typeof PenaltyPolicy => {
  PenaltyPolicy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('LOAN_OVERDUE', 'DISCIPLINARY', 'LOAN_INTEREST'),
        allowNull: false,
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY'),
        allowNull: false,
      },
      gracePeriodDays: {
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      tableName: 'penaltyPolicy',
    },
  );

  return PenaltyPolicy;
};

export default PenaltyPolicy;
