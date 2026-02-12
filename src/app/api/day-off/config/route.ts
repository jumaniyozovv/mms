import { getDayOffConfig, updateDayOffConfig } from "@/backend/services/day-off.service";
import { updateDayOffConfigSchema } from "@/backend/validators/day-off.validators";
import { withRole } from "@/backend/middleware/roles";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/backend/utils/api-response";

export const GET = withRole("ADMIN", async () => {
  try {
    const config = await getDayOffConfig();
    return successResponse(config);
  } catch (error) {
    console.error("Get day off config error:", error);
    return errorResponse("Internal server error", 500);
  }
});

export const PUT = withRole("ADMIN", async (request) => {
  try {
    const body = await request.json();
    const parsed = updateDayOffConfigSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        errors[key] = errors[key] || [];
        errors[key].push(issue.message);
      }
      return validationErrorResponse(errors);
    }

    const config = await updateDayOffConfig(parsed.data);
    return successResponse(config);
  } catch (error) {
    console.error("Update day off config error:", error);
    return errorResponse("Internal server error", 500);
  }
});
