import { Router } from 'express';

const routers = Router();

routers.get('/api', (req, res) => {
  res.json({ message: 'API is working 🚀' });
});

export { routers };
