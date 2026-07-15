import { NextRequest } from "next/server";
import { withAuth } from "@/backend/middleware/auth";
import { updateProject, deleteProject } from "@/backend/services/projects.service";
import { findProjectById } from "@/backend/repositories/projects.repository";
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from "@/backend/utils/api-response";
import { withRole } from "@/backend/middleware/roles";
import { updateProjectSchema } from "@/backend/validators/project.validators";
import { formatZodErrors } from "@/backend/validators/auth.validators";

export const GET = withAuth(async (
  request: NextRequest
) => {
    const id = request.nextUrl.pathname.split('/').pop()!
  const project = await findProjectById(id);
  if (!project) return notFoundResponse("Project not found");
  return successResponse(project);
});

export const PUT = withRole("MANAGER", async (
  request: NextRequest
) => {
  try {
    const body = await request.json();
    const id = request.nextUrl.pathname.split('/').pop()!
    const result = updateProjectSchema.safeParse(body);

   if(!result.success){
    return validationErrorResponse(formatZodErrors(result.error))
   }

   const updatedProject = await updateProject(id, result.data);
    return successResponse(updatedProject,200);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to update project");
  }
});

export const DELETE = withRole("MANAGER",async (
  request: NextRequest
) => {
  try {
    const id = request.nextUrl.pathname.split('/').pop()!
    await deleteProject(id);
    return successResponse({ deleted: true });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Failed to delete project");
  }
});