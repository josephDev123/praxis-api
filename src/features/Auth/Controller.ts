import type { NextFunction, Request, Response } from "express";
import { GlobalErrorHandler } from "../../lib/utils/GlobalErrorHandler.js";
import type { IAuthDTO } from "./DTO/IAuthDTO.js";
import type { IUserInput } from "./schema/AuthSchema.js";
import type { AuthService } from "./service.js";

export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const userInput: IUserInput = {
        email,
        password,
        name,
      };

      if (!userInput.email || !userInput.password || !userInput.name) {
        return next(
          new GlobalErrorHandler(
            "BadRequest",
            "email, password and name are required",
            400,
            true,
          ),
        );
      }

      const result = await this.AuthService.create(userInput);

      const resultDTO: IAuthDTO = {
        id: result.id,
        email: result.email,
        name: result.name,
      };

      res
        .status(201)
        .json({ message: "User register successfully", data: resultDTO });
      return;
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        next(
          new GlobalErrorHandler(
            error.name,
            error.message,
            error.statusCode,
            error.operational,
          ),
        );
        return;
      }
      if (error instanceof Error) {
        next(new GlobalErrorHandler(error.name, error.message, 500, false));
        return;
      }
      next(
        new GlobalErrorHandler(
          "UnknownError",
          "something went wrong",
          500,
          false,
        ),
      );
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const email = payload.email;
      const password = payload.password;
      const result = await this.AuthService.createLogin(email, password);

      // save in the client cookie for authorization in the next request
      res.cookie("token", result.accessToken, {
        maxAge: 1 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      //what should be return to the client after login successful
      const resultDTO: IAuthDTO = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      };
      res.status(200).json({ message: "login successful", data: resultDTO });
      return;
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        next(
          new GlobalErrorHandler(
            error.name,
            error.message,
            error.statusCode,
            error.operational,
          ),
        );
        return;
      }

      if (error instanceof Error) {
        next(new GlobalErrorHandler(error.name, error.message, 500, false));
        return;
      }

      next(
        new GlobalErrorHandler(
          "UnknownError",
          "something went wrong",
          500,
          false,
        ),
      );
    }
  }
}
