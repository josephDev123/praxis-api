import type { PrismaClient } from "../../lib/prisma.js";
import { GlobalErrorHandler } from "../../lib/utils/GlobalErrorHandler.js";
import { omitUndefined } from "../../lib/utils/OmitUndefined.js";
import { prismaErrorHandler } from "../../lib/utils/prismaErrorHandler.js";
import type {
  ICreateTaskInput,
  IUpdateTaskInput,
} from "./schema/CreateTaskSchema.js";
import type { IFilters } from "./types/IFindTaskQuery.js";

export class TaskRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userTask: ICreateTaskInput, currentUserId: number) {
    try {
      const createdTask = await this.db.task.create({
        data: {
          title: userTask.title,
          description: userTask.description,
          dueDate: userTask.dueDate,
          userId: currentUserId,
          ...(userTask.priority && { priority: userTask.priority }),
          ...(userTask.status && { status: userTask.status }),
        },
      });

      return createdTask;
    } catch (error) {
      prismaErrorHandler(error);
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "something went wrong",
        500,
        false,
      );
    }
  }

  async update(userTask: IUpdateTaskInput, TaskId: number, userId: number) {
    try {
      const isMyTask = await this.isMyTask(TaskId, userId);
      if (!isMyTask) {
        throw new GlobalErrorHandler(
          "Forbidden",
          "You are not the owner of this task",
          403,
          true,
        );
      }
      const createdTask = await this.db.task.update({
        where: {
          id: TaskId,
        },
        data: omitUndefined({
          title: userTask.title,
          description: userTask.description,
          dueDate: userTask.dueDate,
          priority: userTask.priority,
          status: userTask.status,
        }),
      });

      return createdTask;
    } catch (error) {
      prismaErrorHandler(error);

      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "something went wrong",
        500,
        false,
      );
    }
  }

  async findAllTaskByUserId(
    userId: number,
    page: number,
    limit: number,
    filters: IFilters,
  ) {
    try {
      const where: any = {
        userId,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
      };

      return await this.db.task.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      prismaErrorHandler(error);

      throw error instanceof GlobalErrorHandler
        ? error
        : new GlobalErrorHandler(
            "UnknownError",
            "Something went wrong",
            500,
            false,
          );
    }
  }

  async Delete(taskId: number, userId: number) {
    try {
      const isMyTask = await this.isMyTask(taskId, userId);
      if (!isMyTask) {
        throw new GlobalErrorHandler(
          "Forbidden",
          "You are not the owner of this task. it can be deleted by the owner only",
          403,
          true,
        );
      }

      const deletedTask = await this.db.task.delete({
        where: {
          id: taskId,
        },
      });
      return deletedTask;
    } catch (error) {
      prismaErrorHandler(error);

      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "something went wrong",
        500,
        false,
      );
    }
  }

  async isMyTask(taskId: number, userId: number) {
    const task = await this.db.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      },
      select: { id: true }, // lightweight query
    });

    return !!task; // true or false
  }
}
