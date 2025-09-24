import { Request, Response } from 'express';
import { DividendService } from '../services/dividendService';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/authMiddleware';

export class DividendController {
  static async getUserDividend(req: IRequestUser, res: Response) {
    try {
      const userId = req.user?.id;
      const groupId = req.user?.groupId;
      if (!userId || !groupId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'User or group not found in token',
          res,
        });
      }
      const data = await DividendService.getUserDividend(userId, groupId);
      return ResponseService({
        data,
        status: 200,
        success: true,
        message: 'User dividend calculated successfully',
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

  static async getGroupDividend(req: IRequestUser, res: Response) {
    try {
      const groupId = req.user?.groupId;
      if (!groupId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Group not found in token',
          res,
        });
      }
      const data = await DividendService.getGroupDividend(groupId);
      return ResponseService({
        data,
        status: 200,
        success: true,
        message: 'Group dividend calculated successfully',
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
