import { Router } from 'express';
import userController from '../controllers/userController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';

const userRouter = Router();

// Authentication routes
userRouter.post('/users/login', userController.loginLocal);
userRouter.post('/users', userController.createUser);

// Protected routes
userRouter.get('/users', authMiddleware, userController.getAllUsers);
userRouter.get(
  '/users/:id',
  authMiddleware,
  checkRole(['admin', 'president', 'secretary', 'treasurer', 'user']),
  userController.getUserById,
);

userRouter.put('/users/complete-profile', authMiddleware, userController.completeProfile);

// User approval (only admin, president, secretary can approve)
userRouter.put(
  '/users/:id/approve',
  authMiddleware,
  checkRole(['admin', 'president', 'secretary']),
  userController.approveUser,
);

// User management (only admin, president, secretary can update)
userRouter.put(
  '/users/:id',
  authMiddleware,
  checkRole(['admin', 'president', 'secretary', 'user']),
  userController.updateUser,
);

// User deletion (only admin can delete)
userRouter.delete('/users/:id', authMiddleware, checkRole(['admin']), userController.deleteUser);

export default userRouter;
