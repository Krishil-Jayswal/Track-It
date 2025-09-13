import express from "express";
import {
  googleAuth,
  googleAuthCallback,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/google", googleAuth);
authRouter.get("/callback/google", googleAuthCallback);

export default authRouter;
