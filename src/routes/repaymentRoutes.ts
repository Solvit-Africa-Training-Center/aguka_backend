import { Router } from 'express';
import { RepaymentController } from '../controllers/repaymentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const repaymentRoutes = Router();

repaymentRoutes.post('/repayments', authMiddleware, RepaymentController.create);
repaymentRoutes.get('/repayments', RepaymentController.getAll);
repaymentRoutes.get('/repayments/:id', RepaymentController.getById);
repaymentRoutes.put('/repayments/:id', RepaymentController.update);
repaymentRoutes.delete('/repayments/:id', RepaymentController.delete);
repaymentRoutes.get('/repayments/loan/:loanId/balance', RepaymentController.getRemainingBalance);

export default repaymentRoutes;
