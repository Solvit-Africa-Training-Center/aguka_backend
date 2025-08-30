import { Router } from 'express';
import uploadRouter from './upload';
import emailRouter from './emailRouter';

const routers = Router();
const allRoutes = [uploadRouter, emailRouter];
routers.use('/api', ...allRoutes);
export { routers };
