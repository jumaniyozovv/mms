import { NextRequest } from "next/server";
import {
  updateTask,
  deleteTask,
} from "@/backend/services/task.service";
import { findTaskById } from "@/backend/repositories/tasks.repository";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";
import { withRole } from "@/backend/middleware/roles";
import { updateTaskSchema } from "@/backend/validators/task.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";

export const GET = withRole("MANAGER", async (
  request: NextRequest
) => {
  const id = request.nextUrl.pathname.split("/").pop()!;
  const task = await findTaskById(id);
  if (!task) return notFoundResponse("Task not found");
  return successResponse(task);
});

export const PUT = withRole("USER",async (
  request: NextRequest
) => {
  try {
    const body = await request.json();
    const id = request.nextUrl.pathname.split("/").pop()!;
    const result = updateTaskSchema.safeParse(body)
    if(!result.success){
      return validationErrorResponse(formatZodErrors(result.error))
    }
    const updated = await updateTask(id, body);
    if(!updated){
      return notFoundResponse("Task not found")
    }
    return successResponse(updated);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to update task");
  }
});

export const DELETE = withRole("MANAGER", async (
  request: NextRequest
) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!;
    await deleteTask(id);
    return successResponse({ deleted: true });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to delete task");
  }
});