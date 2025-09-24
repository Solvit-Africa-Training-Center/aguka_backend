import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/authMiddleware';

const router = Router();

router.get(
  '/admin/overview',
  authMiddleware,
  checkRole(['admin']),
  AdminController.getSystemOverview,
);
router.get(
  '/admin/inactive-users',
  authMiddleware,
  checkRole(['admin']),
  AdminController.getInactiveUsers,
);
router.get(
  '/admin/group-distribution',
  authMiddleware,
  checkRole(['admin']),
  AdminController.getGroupDistribution,
);

export default router;
