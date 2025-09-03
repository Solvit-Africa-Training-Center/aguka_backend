import { Model, DataTypes, Optional, Sequelize } from "sequelize";

export interface GroupAttributes {
  id: string;
  name: string;
  description: string;
  location: string[];
  faq: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id'> {
    id: string;
  }

export class Group
  extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public location!: string[];
  public faq!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: { User: typeof Model & { new (): Model } }): void {
    Group.hasMany(models.User, {
      foreignKey: 'groupId',
      as: 'users',
    });
  }


  public toJSON(): GroupAttributes {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      location: this.location,
      faq: this.faq,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}


export const GroupModel = (sequelize: Sequelize): typeof Group => {
  Group.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.ARRAY(DataTypes.STRING), //  change from ARRAY to JSON
        allowNull: false,
      },
      faq: {
        type: DataTypes.TEXT,
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
      tableName: 'groups',
    }
  );

  return Group;
}
