import { NextRequest } from "next/server";
import { withRole } from "@/backend/middleware/roles";
import { successResponse, notFoundResponse } from "@/backend/utils/api-response";
import { findTaskByKey } from "@/backend/repositories/tasks.repository";

export const GET = withRole("USER", async (request: NextRequest) => {
  const key = request.nextUrl.pathname.split("/").pop()!;

  const task = await findTaskByKey(key);

  if (!task) return notFoundResponse("Task not found");

  return successResponse(task);
});