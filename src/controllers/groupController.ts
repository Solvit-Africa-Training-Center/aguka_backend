import { Request, Response } from 'express';
import { GroupService } from '../services/groupService';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/authMiddleware';
import { GroupCreationValidation, GroupUpdateValidation } from '../schemas/groupSchema';

export class GroupController {
  static async createGroup(req: IRequestUser, res: Response) {
    try {
      const userId = req.user?.id!;

      // Handle location field conversion for multipart/form-data
      let body = { ...req.body };
      if (typeof body.location === 'string') {
        try {
          body.location = JSON.parse(body.location);
        } catch {
          // If it's not JSON, split by comma or treat as single item array
          body.location = body.location.split(',').map((item: string) => item.trim());
        }
      }

      const { error, value } = GroupCreationValidation.validate(body);

      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      // Capture file uploads
      const profilePicture = (req.files as any)?.profilePicture?.[0]?.path;
      const agreementTerms = (req.files as any)?.agreementTerms?.[0]?.path;

      const group = await GroupService.createGroup(
        {
          ...value,
          profilePicture,
          agreementTerms,
        },
        userId,
      );

      return ResponseService({
        res,
        status: 201,
        success: true,
        message: 'Group created successfully',
        data: group,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 500,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async getAllGroups(req: Request, res: Response) {
    try {
      const groups = await GroupService.getAllGroups();
      return ResponseService({
        res,
        status: 200,
        success: true,
        message: 'Groups retrieved successfully',
        data: groups,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 500,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async getGroupById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const group = await GroupService.getGroupById(id);

      if (!group) {
        return ResponseService({
          res,
          status: 404,
          success: false,
          message: 'Group not found',
          data: null,
        });
      }

      return ResponseService({
        res,
        status: 200,
        success: true,
        message: 'Group retrieved successfully',
        data: group,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 500,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async updateGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { error, value } = GroupUpdateValidation.validate(req.body);

      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const profilePicture = (req.files as any)?.profilePicture?.[0]?.path;
      const agreementTerms = (req.files as any)?.agreementTerms?.[0]?.path;

      const group = await GroupService.updateGroup(id, {
        ...value,
        ...(profilePicture && { profilePicture }),
        ...(agreementTerms && { agreementTerms }),
      });

      if (!group) {
        return ResponseService({
          res,
          status: 404,
          success: false,
          message: 'Group not found',
          data: null,
        });
      }

      return ResponseService({
        res,
        status: 200,
        success: true,
        message: 'Group updated successfully',
        data: group,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 500,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async deleteGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await GroupService.deleteGroup(id);

      if (!deleted) {
        return ResponseService({
          res,
          status: 404,
          success: false,
          message: 'Group not found',
          data: null,
        });
      }

      return ResponseService({
        res,
        status: 200,
        success: true,
        message: 'Group deleted successfully',
        data: null,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 500,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async joinGroup(req: IRequestUser, res: Response) {
    try {
      const userId = req.user?.id!;
      const { groupCode } = req.body;

      if (!groupCode) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'Group code is required',
          res,
        });
      }

      await GroupService.joinGroup(userId, groupCode);

      return ResponseService({
        res,
        status: 200,
        success: true,
        message: 'Successfully joined the group',
        data: null,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 400,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  static async getGroupMembers(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const members = await GroupService.getGroupMembers(groupId);

      return ResponseService({
        res,
        status: 200,
        success: true,
        message: 'Group members retrieved successfully',
        data: members,
      });
    } catch (error: any) {
      return ResponseService({
        res,
        status: 500,
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}
