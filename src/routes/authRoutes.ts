import { Router } from "express";
import passport from "passport";
import userController from "../controller/userController";




const authRouter = Router();

// authRouter.post("/login", userController.loginLocal)

authRouter.get("/google", passport.authenticate("google",{scope:["profile","email"]}));

authRouter.get("/google/callback", passport.authenticate("google",{session:false}),userController.loginGoogleCallback);

export default authRouter;