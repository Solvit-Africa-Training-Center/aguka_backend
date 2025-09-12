import { Router } from "express";
import userController from "../controller/userController";
import { authMiddleware, checkRole } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.post("/users/login", userController.loginLocal);
userRouter.post("/users", userController.createUser);


userRouter.get("/users", authMiddleware, userController.getAllUsers);

userRouter.get(  "/users/:id",  authMiddleware,
    checkRole(["admin", "president", "secretary", "treasurer", "user"]),  userController.getUserById
);

 userRouter.put("/users/complete-profile", authMiddleware,userController.completeProfile
    );

userRouter.put("/users/:id", authMiddleware,
   checkRole(["admin", "president", "secretary"]),  userController.updateUser);

userRouter.delete("/users/:id", authMiddleware,checkRole(["admin"] ),  userController.deleteUser);
   
export default userRouter;
