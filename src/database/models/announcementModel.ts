import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { User } from './userModel';
import { Group } from './groupModel';

interface AnnouncementAttributes {
  id: string;
  title: string;
  authorId: string; // user id
  groupId: string; // 6-char group code
  meetingDate: Date;
  meetingTime: string; // e.g. "15:30"
  location: string;
  agenda: string;
  status: 'scheduled' | 'completed' | 'postponed';
  attendeesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type AnnouncementCreationAttributes = Optional<
  AnnouncementAttributes,
  'id' | 'status' | 'attendeesCount' | 'createdAt' | 'updatedAt'
>;

export class Announcement
  extends Model<AnnouncementAttributes, AnnouncementCreationAttributes>
  implements AnnouncementAttributes
{
  public id!: string;
  public title!: string;
  public authorId!: string;
  public groupId!: string;
  public meetingDate!: Date;
  public meetingTime!: string;
  public location!: string;
  public agenda!: string;
  public status!: 'scheduled' | 'completed' | 'postponed';
  public attendeesCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Announcement.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    Announcement.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
  }
}

export const announcementModel = (sequelize: Sequelize) => {
  Announcement.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      title: { type: DataTypes.STRING, allowNull: false },
      authorId: { type: DataTypes.UUID, allowNull: false },
      groupId: { type: DataTypes.STRING(6), allowNull: false },
      meetingDate: { type: DataTypes.DATEONLY, allowNull: false },
      meetingTime: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      agenda: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'postponed'),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      attendeesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      tableName: 'Announcements',
      timestamps: true,
    },
  );

  return Announcement;
};
