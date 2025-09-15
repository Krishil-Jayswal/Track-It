import { TOKEN_TYPE, verifyToken } from "@repo/jwt";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    const payload = verifyToken(token, TOKEN_TYPE.USER);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Error in auth middleware: ", (error as Error).message);
    res.status(401).json({ message: "Token expired" });
  }
};
