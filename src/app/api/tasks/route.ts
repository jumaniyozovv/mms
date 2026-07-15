import { NextRequest } from "next/server";
import { createTask } from "@/backend/services/task.service";
import { createTaskSchema } from "@/backend/validators/task.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";
import { withRole } from "@/backend/middleware/roles";

export const POST = withRole("USER",async (request: NextRequest) => {
  try {
    const body = await request.json();

    const result = createTaskSchema.safeParse(body);
    if (!result.success) {
      return validationErrorResponse(formatZodErrors(result.error));
    }

    const created = await createTask(result.data);

    return successResponse(created, 201);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to create task", 500);
  }
});