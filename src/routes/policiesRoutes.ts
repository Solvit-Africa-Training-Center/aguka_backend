import { Router } from 'express';
import policiesController from '../controllers/policiesController';

const policiesRoutes = Router();

policiesRoutes.post('/policies', policiesController.createPolicy);
policiesRoutes.get('/policies', policiesController.getAll);
// Update loan interest rate by type (move above :id route)
policiesRoutes.put('/policies/loan-interest', policiesController.updateLoanInterestRate);
policiesRoutes.get('/policies/:id', policiesController.getById);
policiesRoutes.put('/policies/:id', policiesController.update);
policiesRoutes.delete('/policies/:id', policiesController.delete);

export default policiesRoutes;
