import { Request, Response } from 'express';
import { IRequestUser } from '../middlewares/authMiddleware';
import { ResponseService } from '../utils/response';
import AnnouncementService from '../services/announcementService';
import { AnnouncementCreateSchema, AnnouncementUpdateSchema } from '../schemas/announcementSchema';

class AnnouncementController {
  static async create(req: IRequestUser, res: Response) {
    try {
      const user = req.user;
      if (!user)
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized',
          res,
        });

      // check role: only secretary of group or admin allowed (you can change logic as needed)
      if (user.role !== 'secretary' && user.role !== 'admin') {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden',
          res,
        });
      }

      const { error, value } = AnnouncementCreateSchema.validate(req.body);
      if (error)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });

      // groupId must come from user or request body (we prefer user.groupId)
      const groupId = user.groupId || (req.body.groupId as string);
      if (!groupId)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'GroupId is required',
          res,
        });

      const ann = await AnnouncementService.createAnnouncement({
        ...value,
        authorId: user.id,
        groupId,
      });

      return ResponseService({
        data: ann,
        status: 201,
        success: true,
        message: 'Announcement created and notifications queued',
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

  static async listGroup(req: IRequestUser, res: Response) {
    try {
      const user = req.user!;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const groupId = user.groupId;
      if (!groupId)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'User has no group',
          res,
        });

      const data = await AnnouncementService.getGroupAnnouncements(groupId, page, limit);
      return ResponseService({
        data,
        status: 200,
        success: true,
        message: 'Announcements retrieved',
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

  static async getById(req: IRequestUser, res: Response) {
    try {
      const { id } = req.params;
      const ann = await AnnouncementService.getAnnouncementById(id);
      if (!ann)
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Not found',
          res,
        });
      return ResponseService({
        data: ann,
        status: 200,
        success: true,
        message: 'Announcement retrieved',
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

  static async update(req: IRequestUser, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;
      const { error, value } = AnnouncementUpdateSchema.validate(req.body);
      if (error)
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });

      const announcement = await AnnouncementService.updateAnnouncement(id, req.body);
      if (!announcement)
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Not found',
          res,
        });

      // only author or admin/secretary should be able to update
      if (user.role !== 'admin' && announcement.authorId !== user.id && user.role !== 'secretary') {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden',
          res,
        });
      }

      // if status changed to completed and attendeesCount provided, you may want to send a followup notification
      const updated = await AnnouncementService.updateAnnouncement(id, value);

      return ResponseService({
        data: updated,
        status: 200,
        success: true,
        message: 'Announcement updated',
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

  static async delete(req: IRequestUser, res: Response) {
    try {
      const user = req.user!;
      const { id } = req.params;
      const ann = await AnnouncementService.getAnnouncementById(id);
      if (!ann)
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Not found',
          res,
        });

      if (user.role !== 'admin' && ann.authorId !== user.id && user.role !== 'secretary') {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden',
          res,
        });
      }

      await AnnouncementService.deleteAnnouncement(id);
      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Announcement deleted',
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
}

export default AnnouncementController;
