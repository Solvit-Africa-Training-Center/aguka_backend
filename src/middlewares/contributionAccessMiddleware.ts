import { Response, NextFunction } from 'express';
import { IRequestUser } from './authMiddleware';
import { ResponseService } from '../utils/response';

export const checkUserContributionAccess = (
  req: IRequestUser,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const authUser = req.user;

  if (!authUser) {
    return ResponseService({
      data: null,
      status: 401,
      success: false,
      message: 'Unauthorized',
      res,
    });
  }

  if (authUser.role === 'admin') return next();

  if (authUser.role === 'user' && userId && userId !== authUser.id) {
    return ResponseService({
      data: null,
      status: 403,
      success: false,
      message: 'Forbidden: you can only access your own contributions',
      res,
    });
  }

  next();
};
