import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/userController';

const authRouter = Router();


authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  userController.loginGoogleCallback,
);

export default authRouter;
