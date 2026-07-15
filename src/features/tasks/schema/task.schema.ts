import { z } from "zod";
import { TaskType, TaskPriority, TaskStatus } from "@/app/generated/prisma/enums";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  type: z.nativeEnum(TaskType),
  priority: z.nativeEnum(TaskPriority),
  status:z.nativeEnum(TaskStatus),
  assigneeId: z.string().optional(),
  projectId: z.string(),
  dueDate: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  description: z.string().max(2000).optional(),
  type: z.nativeEnum(TaskType).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
});

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;