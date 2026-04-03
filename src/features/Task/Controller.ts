import type { NextFunction, Request, Response } from "express";
import type {
  ICreateTaskInput,
  IUpdateTaskInput,
} from "./schema/CreateTaskSchema.js";
import type { TaskService } from "./Service.js";
import { GlobalErrorHandler } from "../../lib/utils/GlobalErrorHandler.js";
import type { IFilters } from "./types/IFindTaskQuery.js";

export class TaskController {
  constructor(private readonly TaskService: TaskService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const currentSession = req.user;

      // this  has been handle by middleware but Typescript need to be sure about it
      if (!currentSession) {
        next(
          new GlobalErrorHandler(
            "Unauthorized",
            "User not authenticated",
            401,
            true,
          ),
        );
        return;
      }
      const { title, description, dueDate, priority, status } = req.body;

      const task: ICreateTaskInput = {
        title,
        description,
        dueDate,
        priority,
        status,
      };

      //   console.log("Received task creation request:", task);

      const createdTask = await this.TaskService.create(
        task,
        currentSession.id,
      );
      res
        .status(201)
        .json({ msg: "Task created successfully", data: createdTask });
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const currentSession = req.user;

      // this  has been handle by middleware but Typescript need to be sure about it
      if (!currentSession) {
        next(
          new GlobalErrorHandler(
            "Unauthorized",
            "User not authenticated",
            401,
            true,
          ),
        );
        return;
      }
      const taskId = Number(req.params.id);

      if (!taskId) {
        next(new GlobalErrorHandler("NotFound", "Task not found", 404, true));
        return;
      }
      const { title, description, dueDate, priority, status } = req.body;

      const task: IUpdateTaskInput = {
        title,
        description,
        dueDate,
        priority,
        status,
      };

      const UpdatedTask = await this.TaskService.update(
        task,
        taskId,
        currentSession.id,
      );
      res
        .status(200)
        .json({ msg: "Task updated successfully", data: UpdatedTask });
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

  async findAllTaskByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const currentSession = req.user;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status?.toString().toUpperCase() as
        | string
        | undefined;
      const priority = req.query.priority?.toString().toUpperCase() as
        | string
        | undefined;

      const filters: IFilters = {
        status,
        priority,
      };

      // this  has been handle by middleware but Typescript need to be sure about it
      if (!currentSession) {
        next(
          new GlobalErrorHandler(
            "Unauthorized",
            "User not authenticated",
            401,
            true,
          ),
        );
        return;
      }

      const tasks = await this.TaskService.findAllTaskByUserId(
        currentSession.id,
        page,
        limit,
        filters,
      );
      res
        .status(200)
        .json({ msg: "Tasks retrieved successfully", data: tasks });
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

  async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const currentSession = req.user;

      // this  has been handle by middleware but Typescript need to be sure about it
      if (!currentSession) {
        next(
          new GlobalErrorHandler(
            "Unauthorized",
            "User not authenticated",
            401,
            true,
          ),
        );
        return;
      }
      const taskId = Number(req.params.id);

      if (!taskId) {
        next(new GlobalErrorHandler("NotFound", "Task not found", 404, true));
        return;
      }

      const DeletedTask = await this.TaskService.Delete(
        taskId,
        currentSession.id,
      );
      res
        .status(200)
        .json({ msg: "Task deleted successfully", data: DeletedTask });
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
