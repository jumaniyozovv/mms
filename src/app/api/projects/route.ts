import { NextRequest } from "next/server";
import { createProject } from "@/backend/services/projects.service";
import { successResponse, errorResponse, validationErrorResponse } from "@/backend/utils/api-response";
import { withRole } from "@/backend/middleware/roles";
import { createProjectSchema } from "@/backend/validators/project.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";

// app/api/projects/route.ts
export const POST = withRole("MANAGER", async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = createProjectSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(formatZodErrors(result.error));

    const project = await createProject(result.data); // no role param needed — withRole already gated it
    return successResponse(project, 201);
  } catch (error) {
    console.error("Create project error:", error);
    return errorResponse("Internal server error", 500);
  }
});