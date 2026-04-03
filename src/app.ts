import express from "express";
import type { IConfig } from "./lib/config.js";
import { HealthRouter } from "./features/health/routes.js";
import cors from "cors";
import { AuthRouter } from "./features/Auth/routes.js";
import type { PrismaClient } from "./lib/prisma.js";
import { ratelimiter } from "./lib/utils/rateLimiter.js";
import { GlobalErrorMiddleware } from "./lib/middleware/GlobalErrorMiddleware.js";
import type { Logger } from "pino";
import { TaskRouter } from "./features/Task/routes.js";
import { requireAuthMiddleware } from "./lib/middleware/requireAuth.js";
import cookieParser from "cookie-parser";

export async function App(config: IConfig, db: PrismaClient, logger: Logger) {
  let windowMs = 10 * 60 * 1000;
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: config.ALLOW_ORIGIN,
    }),
  );

  app.use(cookieParser());

  app.use("/api", HealthRouter(config));
  app.use(
    "/api/auth",
    ratelimiter({
      windowMs: windowMs,
      limit: 4,
      standardHeaders: "draft-8",
      legacyHeaders: true,
    }),
    AuthRouter(config, db),
  );

  app.use(
    "/api/task",
    ratelimiter({
      windowMs: windowMs,
      limit: 4,
      standardHeaders: "draft-8",
      legacyHeaders: true,
    }),
    requireAuthMiddleware,
    TaskRouter(db),
  );

  app.use(GlobalErrorMiddleware(logger));
  return app;
}
