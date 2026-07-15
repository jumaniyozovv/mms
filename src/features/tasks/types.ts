import { Project, User } from "@/app/generated/prisma/client";

export interface Task{
id:string
key:string
title:string
description:string
status:TaskStatus
projectId: string;
project:Project
priority:TaskPriority
type:TaskType
assigneeId:string
assignee:User
createdAt:string
dueDate:string
}

export const TaskStatus = {
    BACKLOG:"BACKLOG",
    TODO:"TODO",
    IN_PROGRESS:"IN_PROGRESS",
    PAUSED:"PAUSED",
    IN_REVIEW:"IN_REVIEW",
    DONE:"DONE",
    BLOCKED:"BLOCKED",
    CANCELLED:"CANCELLED"
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

export const TaskStatusOptions: { label: string; value: TaskStatus }[] = [
  { label: 'Backlog', value: TaskStatus.BACKLOG },
  { label: 'To Do', value: TaskStatus.TODO },
  { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
  { label: 'Paused', value: TaskStatus.PAUSED },
  { label: 'In Review', value: TaskStatus.IN_REVIEW },
  { label: 'Done', value: TaskStatus.DONE },
  { label: 'Cancelled', value: TaskStatus.CANCELLED },
];

export const TaskPriority = {
    LOW:"LOW",
    MEDIUM:"MEDIUM",
    HIGH:"HIGH",
    URGENT:"URGENT"
} as const

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

export const TaskPriorityOptions: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: TaskPriority.LOW },
  { label: 'Medium', value: TaskPriority.MEDIUM },
  { label: 'High', value: TaskPriority.HIGH },
  { label: 'Urgent', value: TaskPriority.URGENT },
];

export const TaskType={
    TASK:"TASK",
    BUG:"BUG",
    FEATURE:"FEATURE"
} as const

export type TaskType = typeof TaskType[keyof typeof TaskType];

export const TaskWorkTypeOptions: { label: string; value: TaskType }[] = [
  { label: 'Bug', value: TaskType.BUG },
  { label: 'Task', value: TaskType.TASK },
  { label: 'Feature', value: TaskType.FEATURE },
];

export interface CreateTaskInput {
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  status:TaskStatus
  assigneeId?: string;
  projectId: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  type?: TaskType;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  dueDate?: string;
  status?:TaskStatus
}

export interface TaskListFilters {
  page: number;
  limit: number;
  search?: string;
  status?: TaskStatus[];       // multi-select
  priority?: TaskPriority[];   // multi-select
  type?: TaskType[];           // multi-select
  assigneeId?: string;         // single value; use "unassigned" as a sentinel, or a separate boolean
  projectId?: string;
  overdue?: boolean;
}