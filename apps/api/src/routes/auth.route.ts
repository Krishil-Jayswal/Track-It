import express from "express";
import {
  getToken,
  googleAuth,
  googleAuthCallback,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.get("/google", googleAuth);
authRouter.get("/callback/google", googleAuthCallback);
authRouter.get("/token", authMiddleware, getToken);

export default authRouter;
