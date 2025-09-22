import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface FeedAttributes {
  id: string;
  authorId: string;
  groupId: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type FeedCreationAttributes = Optional<FeedAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Feed extends Model<FeedAttributes, FeedCreationAttributes> implements FeedAttributes {
  public id!: string;
  public authorId!: string;
  public groupId!: string;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Feed.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    Feed.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    Feed.hasMany(models.Comment, { foreignKey: 'feedId', as: 'comments' });
    Feed.hasMany(models.Like, { foreignKey: 'feedId', as: 'likes' });
  }
}

export const feedModel = (sequelize: Sequelize) => {
  Feed.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Feeds',
      timestamps: true,
      underscored: false,
    },
  );

  return Feed;
};
