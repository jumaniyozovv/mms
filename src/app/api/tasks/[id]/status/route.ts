import { NextRequest } from "next/server";
import { updateTaskStatus } from "@/backend/services/task.service";
import { successResponse, errorResponse } from "@/backend/utils/api-response";
import { z } from "zod";
import { TaskStatus } from "@/app/generated/prisma/enums";
import { withRole } from "@/backend/middleware/roles";

const statusSchema = z.object({ status: z.nativeEnum(TaskStatus) });

export const PATCH = withRole("USER", async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/")[3]; // /api/tasks/[id]/status
    const body = await request.json();
    const result = statusSchema.safeParse(body);
    if (!result.success) return errorResponse("Invalid status", 400);

    const updated = await updateTaskStatus(id, result.data.status);
    return successResponse(updated);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to update status");
  }
});