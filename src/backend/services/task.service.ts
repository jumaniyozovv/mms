import { TaskStatus } from "@/app/generated/prisma/enums";
import {
  createTaskWithKey,
  updateTask as updateTaskInDb,
  deleteTask as deleteTaskInDb,
  findAll,
  findTaskById,
  findTaskByKey,
} from "../repositories/tasks.repository";
import { TaskCreateInput, TaskListFilters, TaskUpdateInput } from "../types/tasks";

export async function createTask(data: TaskCreateInput) {
  return createTaskWithKey(
    {
      title:data.title,
      description:data.description,
      assigneeId:data.assigneeId,
      projectId:data.projectId,
      type:data.type,
      status:data.status,
      priority:data.priority,
      dueDate:data.dueDate ? new Date(data.dueDate):undefined
    }        
)}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const task = await findTaskById(id);
  if (!task) throw new Error("Task not found");
  return updateTaskInDb(id, { status });
}

 export async function updateTask(
    id: string,
    data: TaskUpdateInput
  ) {
    const task = await findTaskById(id);
    if (!task) throw new Error("Task not found");
    return updateTaskInDb(id, data);
  }

export async function deleteTask(id: string) {
    const task = await findTaskById(id);
    if (!task) throw new Error("Task not found");

    return deleteTaskInDb(id);
}

export async function getTaskByKey(key:string){
  return findTaskByKey(key)
}

export async function getTasks(
  filters: TaskListFilters
) {
 
  return findAll(filters);
}