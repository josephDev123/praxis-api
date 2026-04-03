import type { NextFunction, Request, Response } from "express";
import { GlobalErrorHandler } from "../utils/GlobalErrorHandler.js";

export const validateIdParamMiddleware = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = Number(req.params[paramName]);

    if (!Number.isInteger(value) || value <= 0) {
      return next(
        new GlobalErrorHandler("BadRequest", `Invalid ${paramName}`, 400, true),
      );
    }

    req.params[paramName] = value as any; // cast after validation
    next();
  };
};
