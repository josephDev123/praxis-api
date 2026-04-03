import { Router } from "express";
import type { PrismaClient } from "../../lib/prisma.js";
import { TaskController } from "./Controller.js";
import { TaskRepository } from "./Repository.js";
import { TaskService } from "./Service.js";
import { validateIdParamMiddleware } from "../../lib/middleware/validateIDParamMiddleware.js";

export function TaskRouter(db: PrismaClient) {
  const TaskRouter = Router();

  const TRepository = new TaskRepository(db);
  const TService = new TaskService(TRepository);
  const TController = new TaskController(TService);

  TaskRouter.post("/create", TController.create.bind(TController));
  TaskRouter.patch(
    "/update/:id",
    validateIdParamMiddleware("id"),
    TController.update.bind(TController),
  );
  TaskRouter.get("/tasks", TController.findAllTaskByUserId.bind(TController));
  TaskRouter.delete(
    "/delete/:id",
    validateIdParamMiddleware("id"),
    TController.Delete.bind(TController),
  );

  return TaskRouter;
}
