import { Router } from 'express';
import uploadRouter from './upload';
import emailRouter from './emailRoutes';
import userRouter from './userRouter';
import authRouter from './authRoutes';
import groupRouter from './groupRoutes';
import contributionRouter from './contributionRoutes';
import loanRouter from './loanRoutes';
import feedsRouter from './feedRoutes';
import repaymentRoutes from './repaymentRoutes';
import penaltyRouter from './penaltyRoutes';
import policiesRoutes from './policiesRoutes';
import announcementRouter from './announcementRoutes';
import dividendRouter from './dividendRoutes';
import adminRouter from './adminRoutes';

const routers = Router();
const allRoutes = [
  uploadRouter,
  emailRouter,
  userRouter,
  authRouter,
  groupRouter,
  contributionRouter,
  loanRouter,
  feedsRouter,
  repaymentRoutes,
  penaltyRouter,
  policiesRoutes,
  announcementRouter,
  dividendRouter,
  adminRouter,
];
routers.use('/api', ...allRoutes);

export { routers };
