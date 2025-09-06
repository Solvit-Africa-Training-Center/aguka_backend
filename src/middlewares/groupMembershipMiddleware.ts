// src/middlewares/groupMembershipMiddleware.ts
import { Response, NextFunction } from 'express';
import { IRequestUser } from './authMiddleware';
import { User } from '../database/models/userModel';
import { ResponseService } from '../utils/response';

export const checkGroupMembership = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction,
) => {
  const { groupId } = req.params;
  const userId = req.user!.id;

  const membership = await User.findOne({ where: { id: userId, groupId } });
  if (!membership) {
    return ResponseService({
      data: null,
      status: 403,
      success: false,
      message: 'You are not a member of this group',
      res,
    });
  }

  next();
};
