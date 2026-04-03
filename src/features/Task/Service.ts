import { GlobalErrorHandler } from "../../lib/utils/GlobalErrorHandler.js";
import { validationErrorHandler } from "../../lib/utils/validationErrorHandler.js";
import type { TaskRepository } from "./Repository.js";
import {
  createTaskSchema,
  updateTaskSchema,
  type ICreateTaskInput,
  type IUpdateTaskInput,
} from "./schema/CreateTaskSchema.js";
import type { IFilters } from "./types/IFindTaskQuery.js";

export class TaskService {
  constructor(private readonly TaskRepository: TaskRepository) {}

  async create(userTask: ICreateTaskInput, currentUserId: number) {
    try {
      const userInputValidation = validationErrorHandler(
        createTaskSchema,
        userTask,
      );
      const createdTask = await this.TaskRepository.create(
        userInputValidation,
        currentUserId,
      );
      return createdTask;
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "Something went wrong",
        500,
        false,
      );
    }
  }

  async update(userTask: IUpdateTaskInput, taskId: number, userId: number) {
    try {
      const userInputValidation = validationErrorHandler(
        updateTaskSchema,
        userTask,
      );

      const createdTask = await this.TaskRepository.update(
        userInputValidation,
        taskId,
        userId,
      );
      return createdTask;
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "Something went wrong",
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
      return this.TaskRepository.findAllTaskByUserId(
        userId,
        page,
        limit,
        filters,
      );
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "Something went wrong",
        500,
        false,
      );
    }
  }

  async Delete(taskId: number, userId: number) {
    try {
      return this.TaskRepository.Delete(taskId, userId);
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      throw new GlobalErrorHandler(
        "UnknownError",
        "Something went wrong",
        500,
        false,
      );
    }
  }
}
