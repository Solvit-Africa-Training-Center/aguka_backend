import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface LikeAttributes {
  id: string;
  feedId: string;
  userId: string;
  createdAt?: Date;
}

type LikeCreationAttributes = Optional<LikeAttributes, 'id' | 'createdAt'>;

export class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
  public id!: string;
  public feedId!: string;
  public userId!: string;
  public readonly createdAt!: Date;

  static associate(models: any) {
    Like.belongsTo(models.Feed, { foreignKey: 'feedId', as: 'feed' });
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export const likeModel = (sequelize: Sequelize) => {
  Like.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      feedId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize,
      tableName: 'Likes',
      timestamps: true,
      updatedAt: false,
    },
  );
  return Like;
};
