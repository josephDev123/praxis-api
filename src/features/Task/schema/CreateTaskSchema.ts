import { z } from "zod";

export const TaskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const TaskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string(),

  dueDate: z.coerce.date(),

  priority: TaskPriorityEnum.optional(), // defaults handled by DB

  status: TaskStatusEnum.optional(), // defaults handled by DB
});

// TYPE
export type ICreateTaskInput = z.infer<typeof createTaskSchema>;

// this schema is for update
export const updateTaskSchema = createTaskSchema.partial();
export type IUpdateTaskInput = z.infer<typeof updateTaskSchema>;
