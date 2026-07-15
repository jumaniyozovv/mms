import { NextRequest } from "next/server";
import { getTasks } from "@/backend/services/task.service";
import { taskListSchema } from "@/backend/validators/task.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";
import { withRole } from "@/backend/middleware/roles";

export const POST = withRole("USER", async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = taskListSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const tasks = await getTasks(result.data);
    return successResponse(tasks);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to fetch tasks", 500);
  }
});