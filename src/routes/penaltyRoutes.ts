import { Router } from 'express';
import penaltyController from '../controllers/penaltyController';

const penaltyRouter = Router();

penaltyRouter.post('/penalties', penaltyController.createPenalty);
penaltyRouter.get('/penalties', penaltyController.getAllPenalties);
penaltyRouter.get('/penalties/user/:userId', penaltyController.getUserPenalties);
penaltyRouter.put('/penalties/:penaltyId/pay', penaltyController.payPenalty);
penaltyRouter.delete('/penalties/:penaltyId', penaltyController.deletePenalty);

export default penaltyRouter;
