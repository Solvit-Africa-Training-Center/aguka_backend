import { Router } from 'express';
import { ContributionController } from '../controllers/contributionController';
import { authMiddleware, checkRole } from '../middlewares/authMiddleware';
import { checkGroupMembership } from '../middlewares/groupMembershipMiddleware';
import { checkUserContributionAccess } from '../middlewares/contributionAccessMiddleware';

const contributionRouter = Router();

/**
 * @route POST /contributions
 * @desc Create a new contribution
 * @access ProtectedcheckRole(["user", "treasurer", "admin"]),
 */
contributionRouter.post(
  '/contributions',
  authMiddleware,
  checkRole(['treasurer']),
  ContributionController.createContribution,
);

/**
 * @route GET /contributions/:userId/all
 * @desc Get all contributions of a user
 * @access Protected
 */
contributionRouter.get(
  '/contributions/:userId/all',
  authMiddleware,
  checkRole(['user', 'treasurer', 'admin']),
  checkUserContributionAccess,
  ContributionController.getUserContributions,
);

/**
 * @route GET /contributions/:userId
 * @desc Get today's contributions of a user
 * @access Protected
 */
contributionRouter.get(
  '/contributions/:userId',
  authMiddleware,
  checkRole(['user', 'treasurer', 'admin']),
  checkUserContributionAccess,
  ContributionController.getTodayUserContributions,
);

/**
 * @route DELETE /contributions/:id
 * @desc Delete a contribution
 * @access Protected
 */
contributionRouter.delete(
  '/contributions/:id',
  authMiddleware,
  checkRole(['treasurer']),
  ContributionController.deleteContribution,
);

/**
 * @route GET /contributions/:groupId/all
 * @desc Get all users with their contributions in a group
 * @access Protected
 */
/**
 * @route GET /contributions/group/all
 * @desc Get all users with their contributions in the group from token
 * @access Protected
 */
contributionRouter.get(
  '/contributions/group/all',
  authMiddleware,
  ContributionController.getGroupAllContributions,
);

/**
 * @route GET /contributions/:groupId/today
 * @desc Get today's contributions for all users in a group
 * @access Protected
 */
contributionRouter.get(
  '/contributions/:groupId/today',
  authMiddleware,
  ContributionController.getGroupTodayContributions,
);

/**
 * @route PUT /contributions/:id
 * @desc Update a contribution
 * @access Protected
 */
contributionRouter.put(
  '/contributions/:id',
  authMiddleware,
  ContributionController.updateContribution,
);

export default contributionRouter;
