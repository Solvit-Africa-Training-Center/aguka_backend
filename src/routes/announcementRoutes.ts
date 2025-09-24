import { Router } from 'express';
import AnnouncementController from '../controllers/announcementController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import { checkGroupMembership } from '../middlewares/groupMembershipMiddleware';

const announcementRouter = Router();

announcementRouter.post(
  '/announcements',
  authMiddleware,
  checkRole(['secretary', 'president']),
  AnnouncementController.create,
);

announcementRouter.get('/announcements', authMiddleware, AnnouncementController.listGroup);

announcementRouter.get('/announcements/:id', authMiddleware, AnnouncementController.getById);

announcementRouter.patch(
  '/announcements/:id',
  authMiddleware,
  checkRole(['secretary', 'president']),
  AnnouncementController.update,
);

announcementRouter.delete(
  '/announcements/:id',
  authMiddleware,
  checkRole(['secretary', 'president']),
  AnnouncementController.delete,
);

export default announcementRouter;
