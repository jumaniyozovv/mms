import { apiClient } from "@/shared/lib/axios";
import type { Task, CreateTaskInput, UpdateTaskInput, TaskListFilters } from "../types";
import { PaginatedResponse } from "@/features/users/types";
import { TaskStatus } from "@/app/generated/prisma/enums";

export async function getTasks(filters:TaskListFilters): Promise<PaginatedResponse<Task>> {
 return await apiClient.post("/tasks/list",filters);
 
}

export async function fetchTaskByKey(key: string): Promise<Task> {
return await apiClient.get(`/tasks/key/${key}`);
}

export async function createTaskRequest(input: CreateTaskInput): Promise<Task> {
  return await apiClient.post("/tasks", input);
}

export async function updateTaskRequest(id: string, input: UpdateTaskInput): Promise<Task> {
  return await apiClient.put(`/tasks/${id}`, input);
  
}

export async function updateTaskStatusRequest(id: string, status: TaskStatus): Promise<Task> {
return await apiClient.patch(`/tasks/${id}/status`, { status });
}

export async function deleteTaskRequest(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}