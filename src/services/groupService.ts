import { Group } from '../database/models/groupModel';
import { User } from '../database/models/userModel';
import { GroupInterface, AddGroupInterface } from '../types/groupInterface';
import { generateGroupCode } from '../utils/helper';

export class GroupService {
  static async createGroup(groupData: AddGroupInterface, userId: string): Promise<GroupInterface> {
    // Generate a unique 6-character group code
    let groupCode: string;
    let isUnique = false;

    do {
      groupCode = generateGroupCode();
      const existingGroup = await Group.findByPk(groupCode);
      isUnique = !existingGroup;
    } while (!isUnique);

    const group = await Group.create({ ...groupData, id: groupCode });

    // Update the creator to be president of the group
    await User.update(
      {
        role: 'president',
        groupId: groupCode,
        isApproved: true,
      },
      { where: { id: userId } },
    );

    return group.toJSON() as GroupInterface;
  }

  static async getAllGroups(): Promise<GroupInterface[]> {
    const groups = await Group.findAll();
    return groups.map((group) => group.toJSON() as GroupInterface);
  }

  static async getGroupById(id: string): Promise<GroupInterface | null> {
    const group = await Group.findByPk(id);
    return group ? (group.toJSON() as GroupInterface) : null;
  }

  static async updateGroup(
    id: string,
    updateData: Partial<AddGroupInterface>,
  ): Promise<GroupInterface | null> {
    const group = await Group.findByPk(id);
    if (!group) return null;
    await group.update(updateData);
    return group.toJSON() as GroupInterface;
  }

  static async deleteGroup(id: string): Promise<boolean> {
    const deleted = await Group.destroy({ where: { id } });
    return deleted > 0;
  }

  static async joinGroup(userId: string, groupCode: string): Promise<boolean> {
    const group = await Group.findByPk(groupCode);
    if (!group) {
      throw new Error('Invalid group code');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.groupId) {
      throw new Error('User is already a member of a group');
    }

    await user.update({ groupId: groupCode });
    return true;
  }

  static async getGroupMembers(groupId: string): Promise<any[]> {
    const users = await User.findAll({
      where: { groupId },
      attributes: ['id', 'name', 'email', 'phoneNumber', 'role', 'isApproved'],
    });
    return users;
  }
}
