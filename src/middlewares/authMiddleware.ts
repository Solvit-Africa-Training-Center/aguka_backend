import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ResponseService } from "../utils/response";

// Custom request type for controllers
export interface IRequestUser extends Request {
  user?: {
    id?: string;
    email?: string;
    role?: string;
    groupId?: string;
  };
  token?: string;
}

// Unified auth middleware
export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Authentication token is missing",
        res,
      });
    }

    const token = authHeader.split(" ")[1];

    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Normalize user object
    (req as IRequestUser).user = {
      id: decoded.id || decoded.userId || decoded._id,
      email: decoded.email,
      role: decoded.role,
      groupId: decoded.groupId,
    };
    (req as IRequestUser).token = token;

    // ✅ TypeScript-safe check
    const user = (req as IRequestUser).user;
    if (!user || !user.id) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: "Invalid token: missing user id",
        res,
      });
    }

    next();
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: { message, stack },
      status: 401,
      success: false,
      message: "Invalid authentication token",
      res,
    });
  }
};

// Optional role-based middleware
export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as IRequestUser).user;
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return ResponseService({
        data: null,
        status: 403,
        success: false,
        message: "You do not have permission to perform this action",
        res,
      });
    }
    next();
  };
};
