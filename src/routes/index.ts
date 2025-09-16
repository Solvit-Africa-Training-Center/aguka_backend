import { Router } from 'express';
import uploadRouter from './upload';
import emailRouter from './emailRoutes';
import userRouter from './userRouter';
import authRouter from './authRoutes';
import groupRouter from './groupRoutes';
import contributionRouter from './contributionRoutes';
import loanRouter from './loanRoutes';

const routers = Router();
const allRoutes = [
  uploadRouter,
  emailRouter,
  userRouter,
  authRouter,
  groupRouter,
  contributionRouter,
  loanRouter,
];
routers.use('/api', ...allRoutes);

export { routers };
