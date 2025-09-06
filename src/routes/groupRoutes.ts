// src/routes/groupRoutes.ts
import { Router } from 'express';
import { GroupController } from '../controllers/groupController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../utils/upload';

const groupRouter = Router();

/**
 * @route POST /groups
 * @desc Create a new group
 * @access Protected
 */
groupRouter.post(
  '/groups',
  authMiddleware,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'agreementTerms', maxCount: 1 },
  ]),
  GroupController.createGroup,
);

/**
 * @route GET /groups
 * @desc Get all groups
 * @access Protected
 */
groupRouter.get('/groups', authMiddleware, GroupController.getAllGroups);

/**
 * @route GET /groups/:id
 * @desc Get a group by ID
 * @access Protected
 */
groupRouter.get('/groups/:id', authMiddleware, GroupController.getGroupById);

/**
 * @route PUT /groups/:id
 * @desc Update group details
 * @access Protected
 */
groupRouter.put(
  '/groups/:id',
  authMiddleware,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'agreementTerms', maxCount: 1 },
  ]),
  GroupController.updateGroup,
);

/**
 * @route DELETE /groups/:id
 * @desc Delete a group
 * @access Protected
 */
groupRouter.delete('/groups/:id', authMiddleware, GroupController.deleteGroup);

/**
 * @route POST /groups/join
 * @desc Join a group using group code
 * @access Protected
 */
groupRouter.post('/groups/join', authMiddleware, GroupController.joinGroup);

/**
 * @route GET /groups/:groupId/members
 * @desc Get all members of a group
 * @access Protected
 */
groupRouter.get('/groups/:groupId/members', authMiddleware, GroupController.getGroupMembers);

export default groupRouter;
