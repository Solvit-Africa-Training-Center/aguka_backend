import { Feed } from '../database/models/feedModel';
import { Comment } from '../database/models/commentModel';
import { Like } from '../database/models/likeModel';
import { User } from '../database/models/userModel';

class FeedService {
  static async createPost({
    authorId,
    groupId,
    message,
  }: {
    authorId: string;
    groupId: string;
    message: string;
  }) {
    return Feed.create({ authorId, groupId, message });
  }

  static async getGroupFeed({
    groupId,
    page = 1,
    limit = 20,
  }: {
    groupId: string;
    page?: number;
    limit?: number;
  }) {
    const offset = (page - 1) * limit;
    const posts = await Feed.findAll({
      where: { groupId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Comment, as: 'comments' },
        { model: Like, as: 'likes' },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const total = await Feed.count({ where: { groupId } });
    return { posts, total, page, limit };
  }

  static async addComment({
    feedId,
    authorId,
    groupId,
    message,
  }: {
    feedId: string;
    authorId: string;
    groupId: string;
    message: string;
  }) {
    const feed = await Feed.findByPk(feedId);
    if (!feed) throw new Error('Feed message not found');
    if (feed.groupId !== groupId)
      throw new Error('Forbidden: The message does not belong to your group');

    return Comment.create({ feedId, authorId, message });
  }

  static async toggleLike({
    feedId,
    userId,
    groupId,
  }: {
    feedId: string;
    userId: string;
    groupId: string;
  }) {
    const feed = await Feed.findByPk(feedId);
    if (!feed) throw new Error('Feed message not found');
    if (feed.groupId !== groupId)
      throw new Error('Forbidden: The message does not belong to your group');

    const existing = await Like.findOne({ where: { feedId, userId } });
    if (existing) {
      await existing.destroy();
      return { liked: false };
    } else {
      await Like.create({ feedId, userId });
      return { liked: true };
    }
  }

  static async getComments(
    feedId: string,
    groupId: string,
    { page = 1, limit = 20 }: { page?: number; limit?: number },
  ) {
    const feed = await Feed.findByPk(feedId);
    if (!feed) throw new Error('Feed message not found');
    if (feed.groupId !== groupId)
      throw new Error('Forbidden: the message does not belong to your group');

    const offset = (page - 1) * limit;
    const comments = await Comment.findAll({
      where: { feedId },
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'ASC']],
      limit,
      offset,
    });
    const total = await Comment.count({ where: { feedId } });
    return { comments, total, page, limit };
  }

  static async updateFeed(feedId: string, userId: string, message: string) {
    const feed = await Feed.findByPk(feedId);
    if (!feed) throw new Error('Feed message not found');
    if (feed.authorId !== userId)
      throw new Error('Forbidden: you can only change your own message');

    feed.message = message;
    await feed.save();
    return feed;
  }

  static async deleteFeed(feedId: string, userId: string) {
    const feed = await Feed.findByPk(feedId);
    if (!feed) throw new Error('Feed message not found');
    if (feed.authorId !== userId)
      throw new Error('Forbidden: you can only removeyour own messsage');

    await feed.destroy();
    return true;
  }

  static async updateComment(commentId: string, userId: string, message: string) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error('Comment message not found');
    if (comment.authorId !== userId)
      throw new Error('Forbidden: you can only change your own message');

    comment.message = message;
    await comment.save();
    return comment;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error('Comment message not found');
    if (comment.authorId !== userId)
      throw new Error('Forbidden: you can only remove your own message');

    await comment.destroy();
    return true;
  }
}

export default FeedService;
