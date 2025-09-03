import { Router } from 'express';
import uploadRouter from './upload';
import emailRouter from './emailRouter';
import userRouter from './userRouter';
import authRouter from './authRoutes';

const routers = Router();
const allRoutes = [uploadRouter, emailRouter, userRouter, authRouter];
routers.use('/api/auth', ...allRoutes);
export { routers };
