import { Request, Response } from 'express';
import { User } from '../database/models/userModel';
import { Group } from '../database/models/groupModel';
import { ResponseService } from '../utils/response';
import { Op } from 'sequelize';

export class AdminController {
  static async getSystemOverview(req: Request, res: Response) {
    try {
      const totalUsers = await User.count();
      const totalGroups = await Group.count();

      const groups = await Group.findAll({ attributes: ['id', 'name'] });
      const groupStats = await Promise.all(
        groups.map(async (group) => {
          const userCount = await User.count({ where: { groupId: group.id } });
          const president = await User.findOne({
            where: { groupId: group.id, role: 'president' },
            attributes: ['name', 'email', 'phoneNumber'],
          });
          return {
            groupId: group.id,
            groupName: group.name,
            userCount,
            president: president
              ? { name: president.name, email: president.email, phoneNumber: president.phoneNumber }
              : null,
          };
        }),
      );

      return ResponseService({
        data: {
          totalUsers,
          totalGroups,
          groupStats,
        },
        status: 200,
        success: true,
        message: 'System overview retrieved successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  static async getInactiveUsers(req: Request, res: Response) {
    try {
      // Example: users with missing phoneNumber or email (could be considered "inactive" or incomplete)
      const inactiveUsers = await User.findAll({
        where: {
          [Op.or]: [{ phoneNumber: null }, { email: null }],
        } as any,
        attributes: ['id', 'name', 'email', 'phoneNumber'],
      });
      return ResponseService({
        data: inactiveUsers,
        status: 200,
        success: true,
        message: 'Inactive or incomplete users retrieved successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  static async getGroupDistribution(req: Request, res: Response) {
    try {
      const groups = await Group.findAll({ attributes: ['id', 'name'] });
      const totalUsers = await User.count();
      const distribution = await Promise.all(
        groups.map(async (group) => {
          const userCount = await User.count({ where: { groupId: group.id } });
          const percent = totalUsers ? ((userCount / totalUsers) * 100).toFixed(2) : '0.00';
          return {
            groupId: group.id,
            groupName: group.name,
            userCount,
            percent,
          };
        }),
      );
      return ResponseService({
        data: distribution,
        status: 200,
        success: true,
        message: 'Group distribution retrieved successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }
}
