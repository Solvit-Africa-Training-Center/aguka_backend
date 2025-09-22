import { Router } from 'express';
import FeedController from '../controllers/feedController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkGroupMembership } from '../middlewares/groupMembershipMiddleware';

const feedsRouter = Router();

/**
 * POST /feeds
 * body: { message }
 * protected (member)
 */
feedsRouter.post('/feeds', authMiddleware, FeedController.createPost);

/**
 * GET /feeds/group  -> group's feed for token's group
 * query: page, limit
 */
feedsRouter.get('/feeds', authMiddleware, FeedController.getGroupFeed);

/**
 * POST /feeds/:feedId/comments
 */
feedsRouter.post('/feeds/:feedId/comments', authMiddleware, FeedController.addComment);

/**
 * GET /feeds/:feedId/comments
 */
feedsRouter.get('/feeds/:feedId/comments', authMiddleware, FeedController.getComments);

/**
 * POST /feeds/:feedId/like  -> toggle like
 */
feedsRouter.post('/feeds/:feedId/like', authMiddleware, FeedController.toggleLike);

// Update feed
feedsRouter.put('/feeds/:id', authMiddleware, FeedController.updateFeed);

// Delete feed
feedsRouter.delete('/feeds/:id', authMiddleware, FeedController.deleteFeed);

// Update comment
feedsRouter.put('/comments/:id', authMiddleware, FeedController.updateComment);

// Delete comment
feedsRouter.delete('/comments/:id', authMiddleware, FeedController.deleteComment);

export default feedsRouter;
