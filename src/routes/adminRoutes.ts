import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/authMiddleware';

const adminRouter = Router();

adminRouter.get(
  '/admin/overview',
  authMiddleware,
  checkRole(['admin']),
  AdminController.getSystemOverview,
);
adminRouter.get(
  '/admin/inactive-users',
  authMiddleware,
  checkRole(['admin']),
  AdminController.getInactiveUsers,
);
adminRouter.get(
  '/admin/group-distribution',
  authMiddleware,
  checkRole(['admin']),
  AdminController.getGroupDistribution,
);

export default adminRouter;
