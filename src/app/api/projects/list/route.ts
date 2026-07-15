import { NextRequest } from "next/server";
import { withAuth } from "@/backend/middleware/auth";
import { getProjects } from "@/backend/services/projects.service";
import { successResponse, errorResponse, validationErrorResponse } from "@/backend/utils/api-response";
import { projectListSchema } from "@/backend/validators/project.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const result = projectListSchema.safeParse(body)
    if(!result.success) return validationErrorResponse(formatZodErrors(result.error)) 
    
    const data = await getProjects(result.data);
    return successResponse(data);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to fetch projects");
  }
});