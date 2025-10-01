import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface CommentAttributes {
  id: string;
  feedId: string;
  authorId: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreationAttributes = Optional<CommentAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: string;
  public feedId!: string;
  public authorId!: string;
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Comment.belongsTo(models.Feed, { foreignKey: 'feedId', as: 'feed' });
    Comment.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  }
}

export const commentModel = (sequelize: Sequelize) => {
  Comment.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      feedId: { type: DataTypes.UUID, allowNull: false },
      authorId: { type: DataTypes.UUID, allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      tableName: 'Comments',
      timestamps: true,
    },
  );
  return Comment;
};
