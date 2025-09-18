import { Request, Response } from 'express';
import { Contribution } from '../database/models/contributionModel';
import { ResponseService } from '../utils/response';
import {
  ContributionValidation,
  ContributionUpdateValidation,
} from '../schemas/contributionSchema';
import { Op } from 'sequelize';
import { User } from '../database/models/userModel';
import { IRequestUser } from '../middlewares/authMiddleware';

export class ContributionController {
  static async createContribution(req: IRequestUser, res: Response) {
    try {
      const loggedInUserId = req.user?.id;
      if (!loggedInUserId) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'User not authenticated',
          res,
        });
      }

      const contributionData = {
        ...req.body,
        recordedBy: loggedInUserId,
      };

      const { error, value } = ContributionValidation.validate(contributionData);
      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const user = await User.findByPk(value.userId);
      if (!user) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'User not found',
          res,
        });
      }

      const contribution = await Contribution.create(value);

      return ResponseService({
        data: contribution,
        status: 201,
        success: true,
        message: 'Contribution recorded successfully',
        res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      return ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        message: 'Failed to create contribution',
        res,
      });
    }
  }

  static async getUserContributions(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const contributions = await Contribution.findAll({ where: { userId } });

      return ResponseService({
        data: contributions,
        status: 200,
        success: true,
        message: 'User contributions retrieved successfully',
        res,
      });
    } catch (err) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: (err as Error).message,
        res,
      });
    }
  }

  static async getTodayUserContributions(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const contributions = await Contribution.findAll({
        where: {
          userId,
          contributionDate: { [Op.between]: [startOfDay, endOfDay] },
        },
      });

      return ResponseService({
        data: contributions,
        status: 200,
        success: true,
        message: "Today's contributions retrieved successfully",
        res,
      });
    } catch (err) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: (err as Error).message,
        res,
      });
    }
  }

  static async deleteContribution(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const contribution = await Contribution.findByPk(id);
      if (!contribution) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Contribution not found',
          res,
        });
      }

      await contribution.destroy();

      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Contribution deleted successfully',
        res,
      });
    } catch (err) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: (err as Error).message,
        res,
      });
    }
  }

  static async updateContribution(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { error, value } = ContributionUpdateValidation.validate(req.body);

      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const contribution = await Contribution.findByPk(id);
      if (!contribution) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Contribution not found',
          res,
        });
      }

      await contribution.update(value);

      return ResponseService({
        data: contribution,
        status: 200,
        success: true,
        message: 'Contribution updated successfully',
        res,
      });
    } catch (err) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: (err as Error).message,
        res,
      });
    }
  }

  static async getGroupAllContributions(req: Request, res: Response) {
    try {
      // Get groupId from JWT token
      const groupId = (req as any).user?.groupId;
      if (!groupId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Group ID not found in token',
          res,
        });
      }
      // Ensure groupId is treated as a string, not UUID
      const users = await User.findAll({
        where: { groupId: String(groupId) },
        include: [{ model: Contribution, as: 'contributions', required: false }],
      });
      return ResponseService({
        data: users,
        status: 200,
        success: true,
        message: 'All users with their contributions retrieved successfully',
        res,
      });
    } catch (err) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: (err as Error).message,
        res,
      });
    }
  }

  // Get today's contributions for all users in a group
  static async getGroupTodayContributions(req: Request, res: Response) {
    try {
      // Get groupId from JWT token
      const groupId = (req as any).user?.groupId;
      if (!groupId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Group ID not found in token',
          res,
        });
      }
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      // Ensure groupId is treated as a string, not UUID
      const users = await User.findAll({
        where: { groupId: String(groupId) },
        include: [
          {
            model: Contribution,
            as: 'contributions',
            where: { contributionDate: { [Op.between]: [startOfDay, endOfDay] } },
            required: false,
          },
        ],
      });
      return ResponseService({
        data: users,
        status: 200,
        success: true,
        message: "All users with today's contributions retrieved successfully",
        res,
      });
    } catch (err) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: (err as Error).message,
        res,
      });
    }
  }
}
