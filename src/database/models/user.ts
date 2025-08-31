import { Model, DataTypes, Optional, Sequelize, ModelStatic } from "sequelize";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'admin' | 'president' | 'secretary' | 'treasurer' | 'user';
  googleId?: string;
  provider?: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public phoneNumber!: string;
  public password!: string;
  public role!: 'admin' | 'president' | 'secretary' | 'treasurer' | 'user';
  public googleId?: string;
  public provider?: string;
  public groupId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;


  static associate(models: { Group: ModelStatic<Model<any, any>> }): void {
    User.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group',
    });
  }
}

export function initUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
      tableName: 'users',
    }
  );

  return User;
}
