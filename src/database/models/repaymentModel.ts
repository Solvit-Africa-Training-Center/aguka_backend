import sequelize, { DataTypes } from 'sequelize';
import { Model, Optional } from 'sequelize';

interface RepaymentAttributes {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  status: 'PENDING' | 'PAID' | 'LATE';
  remainingBalance: number;
  penaltyAmount: number;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
interface RepaymentCreationAttributes
  extends Optional<
    RepaymentAttributes,
    'id' | 'status' | 'remainingBalance' | 'penaltyAmount' | 'createdAt' | 'updatedAt'
  > {}

export class Repayment
  extends Model<RepaymentAttributes, RepaymentCreationAttributes>
  implements RepaymentAttributes
{
  public id!: string;
  public loanId!: string;
  public userId!: string;
  public amount!: number;
  public paymentDate!: Date;
  public status!: 'PENDING' | 'PAID' | 'LATE';
  public remainingBalance!: number;
  public penaltyAmount!: number;
  public paymentMethod!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: {
    User: sequelize.ModelStatic<Model<any, any>>;
    Loan: sequelize.ModelStatic<Model<any, any>>;
  }): void {
    Repayment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Repayment.belongsTo(models.Loan, { foreignKey: 'loanId', as: 'loan' });
  }
}

export const RepaymentModel = (sequelizeInstance: sequelize.Sequelize) => {
  Repayment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      loanId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'LATE'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      remainingBalance: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      penaltyAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: 'repayments',
    },
  );
  return Repayment;
};
