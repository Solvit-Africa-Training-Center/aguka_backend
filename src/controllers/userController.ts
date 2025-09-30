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
import { destroyToken } from '../utils/helper';

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
      const { accessToken, refreshToken } = await AuthService.loginLocal(identifier, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'PROD',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ResponseService({
        data: { accessToken },
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
      const user = (req as any).user;

      const { accessToken, refreshToken } = await AuthService.generateToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'PROD',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        groupId: user.groupId,
        isApproved: user.isApproved,
      };
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      return res.redirect(`${frontendUrl}/login?token=${encodeURIComponent(accessToken)}`);
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
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

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Refresh token missing',
          res,
        });
      }
      const tokens = await AuthService.refreshToken(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.ENV === 'PROD',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return ResponseService({
        data: { accessToken: tokens.accessToken },
        status: 200,
        success: true,
        message: 'Token refreshed successfully',
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

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Password reset email sent',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Password reset successful',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      return ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Logged out successfully',
        res,
      });
    } catch (error: any) {
      return ResponseService({
        data: null,
        status: 400,
        success: false,
        message: error.message,
        res,
      });
    }
  }

  async getMe(req: IRequestUser, res: Response) {
    try {
      const userId = req.user?.id as string;
      const user = await userService.getUserById(userId);
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
        message: error.message,
        res,
      });
    }
  }
}

export default new UserController();
