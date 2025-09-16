import { Request, Response } from 'express';
import userService from '../services/userService';
import AuthService from '../services/authService';
import {
  userCreationValidation,
  LoginUserSchema,
  UserApprovalSchema,
  UserUpdateSchema,
} from '../schemas/userSchema';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/authMiddleware';

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { error, value } = userCreationValidation.validate(req.body);
      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const user = await userService.createUser({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      return ResponseService({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
        },
        status: 201,
        success: true,
        message: 'User created successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: 'Failed to create a user',
        error: error.message,
        res,
      });
    }
  }

  // Local login (email/phone/identifier + password)
  async loginLocal(req: Request, res: Response) {
    try {
      const { error, value } = LoginUserSchema.validate(req.body);
      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const { identifier, password } = value;
      const { token } = await AuthService.loginLocal(identifier, password);

      return ResponseService({
        data: { token },
        status: 200,
        success: true,
        message: 'Login successful',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  // Google login callback
  async loginGoogleCallback(req: Request, res: Response) {
    try {
      const user = (req as any).user; // passport attaches user

      // Generate token directly since user is already created/found by passport
      const token = AuthService.generateToken(user);
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        groupId: user.groupId,
        isApproved: user.isApproved,
      };

      return ResponseService({
        data: { token, user: userData },
        status: 200,
        success: true,
        message: 'Google login successful',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return ResponseService({
        data: users,
        status: 200,
        success: true,
        message: 'Users retrieved successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: 'Failed to retrieve users',
        error: error.message,
        res,
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          res,
        });
      }

      return ResponseService({
        data: user,
        status: 200,
        success: true,
        message: 'User retrieved successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: 'Failed to retrieve user',
        error: error.message,
        res,
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { error, value } = UserUpdateSchema.validate(req.body);
      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const updatedUser = await userService.updateUser(id, value);
      if (!updatedUser) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          res,
        });
      }

      return ResponseService({
        data: updatedUser,
        status: 200,
        success: true,
        message: 'User updated successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          res,
        });
      }

      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'User deleted successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  // Approve user
  async approveUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { error, value } = UserApprovalSchema.validate(req.body);
      if (error) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: error.details[0].message,
          res,
        });
      }

      const approvedUser = await AuthService.approveUser(id, value.isApproved);

      return ResponseService({
        data: approvedUser,
        status: 200,
        success: true,
        message: `User ${value.isApproved ? 'approved' : 'disapproved'} successfully`,
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  // Complete profile
  async completeProfile(req: IRequestUser, res: Response) {
    try {
      const user = req.user as { id: string };
      const { phoneNumber, groupId } = req.body;

      if (!phoneNumber || !groupId) {
        return ResponseService({
          data: null,
          status: 400,
          success: false,
          message: 'phoneNumber and groupId are required',
          res,
        });
      }

      const updatedUser = await AuthService.completeProfile(user.id, { phoneNumber, groupId });

      return ResponseService({
        data: updatedUser,
        status: 200,
        success: true,
        message: 'Profile completed successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 500,
        success: false,
        message: error.message,
        res,
      });
    }
  }
}

export default new UserController();
