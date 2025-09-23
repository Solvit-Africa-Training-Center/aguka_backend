import sequelize, { DataTypes } from 'sequelize';
import { Model, Optional } from 'sequelize';

export interface PenaltyAtrributes {
  id: string;
  userId: string;
  loanId: string | null;
  policyId: string | null;
  type: 'LOAN_OVERDUE' | 'DISCIPLINARY';
  amount: number;
  description: string;
  status: 'PENDING' | 'PAID';
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethod: string;
}

export interface PenaltyCreationAttributes
  extends Optional<
    PenaltyAtrributes,
    'id' | 'loanId' | 'policyId' | 'description' | 'createdAt' | 'updatedAt'
  > {}

export class Penalty
  extends Model<PenaltyAtrributes, PenaltyCreationAttributes>
  implements PenaltyAtrributes
{
  public id!: string;
  public userId!: string;
  public loanId!: string | null;
  public policyId!: string | null;
  public type!: 'LOAN_OVERDUE' | 'DISCIPLINARY';
  public amount!: number;
  public status!: 'PENDING' | 'PAID';
  public description!: string;
  public paymentMethod!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  static associate(models: {
    User: sequelize.ModelStatic<Model<any, any>>;
    Loan: sequelize.ModelStatic<Model<any, any>>;
    PenaltyPolicy: sequelize.ModelStatic<Model<any, any>>;
  }): void {
    Penalty.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Penalty.belongsTo(models.Loan, { foreignKey: 'loanId', as: 'loan' });
    Penalty.belongsTo(models.PenaltyPolicy, { foreignKey: 'policyId', as: 'policy' });
  }
}

export const PenaltyModel = (sequelize: sequelize.Sequelize): typeof Penalty => {
  Penalty.init(
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
      loanId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      policyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('LOAN_OVERDUE', 'DISCIPLINARY'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PAID'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
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
      tableName: 'penalties',
    },
  );

  return Penalty;
};
