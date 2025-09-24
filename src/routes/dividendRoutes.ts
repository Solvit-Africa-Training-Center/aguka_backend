import { Router } from 'express';
import { DividendController } from '../controllers/dividendController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route GET /dividends/me
 * @desc Get current user's dividend in a group
 * @access Protected (president, treasurer, user)
 */
router.get('/dividends/me', authMiddleware, DividendController.getUserDividend);

/**
 * @route GET /dividends/group
 * @desc Get group dividend
 * @access Protected (president, treasurer)
 */
router.get(
  '/dividends/group',
  authMiddleware,
  checkRole(['president', 'treasurer']),
  DividendController.getGroupDividend,
);

export default router;
