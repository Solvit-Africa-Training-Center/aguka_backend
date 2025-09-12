import { Router } from 'express';
import uploadRouter from './upload';
import emailRouter from './emailRouter';
import userRouter from './userRouter';
import authRouter from './authRoutes';
import loanRouter from './loanRoutes';

const routers = Router();
routers.use('/api', uploadRouter);
routers.use('/api', emailRouter);
routers.use('/api', userRouter);
routers.use('/api', authRouter);
routers.use('/api', loanRouter);

export { routers };
