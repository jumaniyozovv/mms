import { NextRequest } from "next/server";
import { withAuth } from "@/backend/middleware/auth";
import { successResponse } from "@/backend/utils/api-response";
import { getUserDeviceSessions } from "@/backend/socket/session.service";

export const GET = withAuth(
  async (_request: NextRequest, { user }) => {
    const sessions = await getUserDeviceSessions(user.userId);
    return successResponse(sessions);
  }
);
