import { Request, Response } from 'express';
import FeedService from '../services/feedService';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/authMiddleware';
import { CreateFeedSchema, CreateCommentSchema, PaginationSchema } from '../schemas/feedSchema';

class FeedController {
  static async createPost(req: IRequestUser, res: Response) {
    try {
      const { error, value } = CreateFeedSchema.validate(req.body);
      if (error)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.message,
          res,
        });

      const authorId = req.user?.id;
      const groupId = req.user?.groupId;
      if (!authorId || !groupId) {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'You must belong to a group to post',
          res,
        });
      }

      const post = await FeedService.createPost({ authorId, groupId, message: value.message });
      return ResponseService({
        data: post,
        status: 201,
        success: true,
        message: 'Post created',
        res,
      });
    } catch (err: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: err.message,
        res,
      });
    }
  }

  static async getGroupFeed(req: IRequestUser, res: Response) {
    try {
      const groupId = req.user?.groupId;
      if (!groupId)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Group ID not found in token',
          res,
        });

      const { error, value } = PaginationSchema.validate(req.query);
      if (error)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.message,
          res,
        });

      const result = await FeedService.getGroupFeed({
        groupId,
        page: value.page,
        limit: value.limit,
      });
      return ResponseService({
        data: result,
        status: 200,
        success: true,
        message: 'Feed fetched',
        res,
      });
    } catch (err: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: err.message,
        res,
      });
    }
  }

  static async addComment(req: IRequestUser, res: Response) {
    try {
      const { feedId } = req.params;
      const { error, value } = CreateCommentSchema.validate(req.body);
      if (error)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.message,
          res,
        });

      const authorId = req.user?.id;
      const groupId = req.user?.groupId;
      if (!authorId || !groupId)
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Not authenticated',
          res,
        });

      const comment = await FeedService.addComment({
        feedId,
        authorId,
        groupId,
        message: value.message,
      });
      return ResponseService({
        data: comment,
        status: 201,
        success: true,
        message: 'Comment added',
        res,
      });
    } catch (err: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: err.message,
        res,
      });
    }
  }

  static async toggleLike(req: IRequestUser, res: Response) {
    try {
      const { feedId } = req.params;
      const userId = req.user?.id as string;
      const groupId = req.user?.groupId as string;
      if (!userId || !groupId)
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Not authenticated',
          res,
        });

      const result = await FeedService.toggleLike({ feedId, userId, groupId });
      return ResponseService({
        data: result,
        status: 200,
        success: true,
        message: result.liked ? 'Liked' : 'Unliked',
        res,
      });
    } catch (err: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: err.message,
        res,
      });
    }
  }

  static async getComments(req: IRequestUser, res: Response) {
    try {
      const { feedId } = req.params;
      const groupId = req.user?.groupId as string;
      const { error, value } = PaginationSchema.validate(req.query);
      if (error)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.message,
          res,
        });

      const result = await FeedService.getComments(feedId, groupId, {
        page: value.page,
        limit: value.limit,
      });
      return ResponseService({
        data: result,
        status: 200,
        success: true,
        message: 'Comments fetched',
        res,
      });
    } catch (err: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: err.message,
        res,
      });
    }
  }

  static async updateFeed(req: IRequestUser, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const updatedFeed = await FeedService.updateFeed(id, req.user!.id!, message);

      return ResponseService({
        data: updatedFeed,
        status: 200,
        success: true,
        message: 'Feed updated successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  static async deleteFeed(req: IRequestUser, res: Response) {
    try {
      const { id } = req.params;
      await FeedService.deleteFeed(id, req.user!.id!);

      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Feed deleted successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  static async updateComment(req: IRequestUser, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const updatedComment = await FeedService.updateComment(id, req.user!.id!, message);

      return ResponseService({
        data: updatedComment,
        status: 200,
        success: true,
        message: 'Comment updated successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  static async deleteComment(req: IRequestUser, res: Response) {
    try {
      const { id } = req.params;
      await FeedService.deleteComment(id, req.user!.id!);

      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Comment deleted successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: error.message,
        res,
      });
    }
  }
}

export default FeedController;
