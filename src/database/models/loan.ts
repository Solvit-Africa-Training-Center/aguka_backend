import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';
export interface LoanAttributes {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  totalPayable: number;
  startDate: Date;
  dueDate: Date;
  durationMonths: number;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanCreationAttributes
  extends Optional<LoanAttributes, 'id' | 'status' | 'approvedBy' | 'createdAt' | 'updatedAt'> {}

export class Loan extends Model<LoanAttributes, LoanCreationAttributes> implements LoanAttributes {
  id!: string;
  userId!: string;
  amount!: number;
  interestRate!: number;
  totalPayable!: number;
  startDate!: Date;
  dueDate!: Date;
  durationMonths!: number;
  status!: 'PENDING' | 'APPROVED' | 'DENIED';
  approvedBy!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  static associate(modes: { User: ModelStatic<Model<any, any>> }): void {
    Loan.belongsTo(modes.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export const LoanModel = (sequelize: Sequelize): typeof Loan => {
  Loan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      interestRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalPayable: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      durationMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'DENIED'),
        allowNull: false,
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
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
    { sequelize, modelName: 'loan' },
  );

  return Loan;
};
