import { TaskPriority, TaskStatus, TaskType } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(TaskType),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  assigneeId: z.string().optional(),
  projectId: z.string(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  description: z.string().max(2000).optional(),
  type: z.enum(TaskType).optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
});

export const taskListSchema = z.object({
  page: z.number().int().min(1, "Page must be at least 1"),
  limit: z.number().int().min(1).max(500, "Limit must be between 1 and 500"),
  search: z.string().optional().optional(),
  status: z.array(z.enum(TaskStatus)).optional(),
  priority: z.array(z.enum(TaskPriority)).optional(),
  type: z.array(z.enum(TaskType)).optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  overdue: z.boolean().optional(),
});

export type CreateTaskSchemaInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchemaInput = z.infer<typeof updateTaskSchema>;
export type TaskListSchemaInput = z.infer<typeof taskListSchema>;