import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { GlobalErrorHandler } from "../utils/GlobalErrorHandler.js";

export const requireAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    next(new GlobalErrorHandler("Unauthorized", "Token is empty", 401, true));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // console.log("Decoded token:", decoded);
    req.user = decoded as unknown as {
      id: number;
      email: string;
      name: string;
    };
    next();
  } catch (err) {
    next(
      new GlobalErrorHandler(
        "InvalidToken",
        "Invalid or expired token",
        403,
        true,
      ),
    );
    return;
  }
};
