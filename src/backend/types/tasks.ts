import { TaskPriority, TaskStatus, TaskType } from "@/app/generated/prisma/enums"



export interface TaskUpdateInput {
  title: string;
  description?: string;
  type: TaskType;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string; 
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  type: TaskType;
  status:TaskStatus;
  priority: TaskPriority;
  projectId:string;
  assigneeId?: string;
  dueDate?: string;
}

export interface TaskListFilters {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  assigneeId?: string; // "unassigned" is a special sentinel value
  projectId?: string;
  overdue?: boolean;
}