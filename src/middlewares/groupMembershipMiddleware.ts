import { Response, NextFunction } from 'express';
import { IRequestUser } from './authMiddleware';
import { ResponseService } from '../utils/response';

export const checkGroupMembership = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  const groupId = req.params.groupId || req.params.id;
  if (!user) {
    return ResponseService({
      data: null,
      status: 401,
      success: false,
      message: 'Unauthorized',
      res,
    });
  }

  if (user.role === 'admin') {
    return next();
  }

  if (user.groupId !== groupId) {
    return ResponseService({
      data: null,
      status: 403,
      success: false,
      message: 'Forbidden: not your group',
      res,
    });
  }

  next();
};
