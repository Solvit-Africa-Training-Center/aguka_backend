import { Router } from 'express';
import loanController from '../controllers/loanController';
import { authMiddleware } from '../middlewares/authMiddleware';

const loanRouter = Router();

// Request a loan
loanRouter.post('/loans/request', authMiddleware, loanController.requestLoan);

// Get a single loan
loanRouter.get('/loans/:id', authMiddleware, loanController.getLoan);

// Get all loans for a user
loanRouter.get('/users/loans/:userId', authMiddleware, loanController.getUserLoans);

// Get all loans for a group
loanRouter.get('/groups/loans/:groupId', authMiddleware, loanController.getGroupLoans);

// Get all loans
loanRouter.get('/loans', authMiddleware, loanController.getAllLoans);

// Get loans by status
loanRouter.get('/loans/status/:status', authMiddleware, loanController.getLoansByStatus);

// Update a loan
loanRouter.put('/loans/:id', authMiddleware, loanController.updateLoan);

// Delete a loan
loanRouter.delete('/loans/:id', authMiddleware, loanController.deleteLoan);

// Approve a loan
loanRouter.patch('/loans/:id/approve', authMiddleware, loanController.approveLoan);

// Deny a loan
loanRouter.patch('/loans/:id/deny', authMiddleware, loanController.denyLoan);

export default loanRouter;
