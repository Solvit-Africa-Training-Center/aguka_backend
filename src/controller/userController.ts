import { Request, Response } from "express";
import userService from "../service/userService";
import AuthService from "../service/authService";

class UserController {
  // Step 1: Create user without groupI
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, phoneNumber } = req.body;

    
      if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({
          message: "Name, email, phoneNumber, and password are required",
        });
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        phoneNumber,
        role: "user", // default role
      });

      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({
        message: "Failed to create a user",
        error: error.message || error,
      });
    }
  }

  // Step 2: Assign groupId later
  async assignGroup(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { groupId } = req.body;

      if (!groupId) {
        return res.status(400).json({ message: "groupId is required" });
      }

      const updatedUser = await userService.updateUser(id, { groupId });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: "Failed to retrieve user", error: error.message });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedUser = await userService.updateUser(id, req.body);
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: errorMessage });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: errorMessage });
    }
  }

  //  Local login (email/phone/identifier + password)
  async loginLocal(req: Request, res: Response) {
    try {
      const { identifier, email, phoneNumber, password } = req.body;

      // accept either identifier, email, or phoneNumber
      const loginId = identifier || email || phoneNumber;

      if (!loginId || !password) {
        return res.status(400).json({ message: "Identifier/email/phone and password required" });
      }

      const { token} = await AuthService.loginLocal(loginId, password);
      return res.status(200).json({ token });
    } catch (error: any) {
      return res.status(401).json({ message: error.message || error });
    }
  }

  //  Google login callback
  async loginGoogleCallback(req: Request, res: Response) {
    try {
      const user = (req as any).user; // passport attaches user
      const token = await AuthService.generateToken(user);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(401).json({ message: error.message || error });
    }
  }

  async assigningGroup(req: Request, res:Response){
    try {
      const { id } = req.params;
      const { groupId } = req.body;

      if (!groupId) {
        return res.status(400).json({ message: "groupId is required" });
      }

      const updatedUser = await userService.assignGroup(id, groupId);
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      return res.status(200).json(updatedUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: errorMessage });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      const updatedUser = await userService.updateUser(id, { role });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      return res.status(200).json(updatedUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: errorMessage });
    }
  }
   async completeProfile(req: Request, res: Response) {
    try {
      // Ensure JWT middleware attached user
      
      const user = (req as any).user as { id: string;};
      console.log("User found:", user);

      const userId = user.id;
      const { phoneNumber, groupId } = req.body;

      if (!phoneNumber || !groupId) {
        return res.status(400).json({ message: "phoneNumber and groupId are required" });
      }

      // Call service to update user profile
      const updatedUser = await AuthService.completeProfile(userId, { phoneNumber, groupId });

      return res.status(200).json({
        message: "Profile completed successfully",
        user: updatedUser,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ message: errorMessage });
    }
  }
}
export default new UserController();
