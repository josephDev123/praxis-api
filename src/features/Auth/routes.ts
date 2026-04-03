import { Router } from "express";
import type { IConfig } from "../../lib/config.js";
import { AuthController } from "./Controller.js";
import { AuthService } from "./service.js";
import { AuthRepository } from "./Repository.js";
import type { PrismaClient } from "../../lib/prisma.js";

export function AuthRouter(config: IConfig, db: PrismaClient) {
  const router = Router();

  const AuthRepositoryImpl = new AuthRepository(db);
  const AuthServiceImpl = new AuthService(
    AuthRepositoryImpl,
    config.JWT_SECRET,
  );

  const controller = new AuthController(AuthServiceImpl);

  router.post("/register", controller.create.bind(controller));
  router.post("/login", controller.login.bind(controller));

  return router;
}
