import { NextRequest } from "next/server";
import { withRole } from "@/backend/middleware/roles";
import { successResponse } from "@/backend/utils/api-response";
import { prisma } from "@/backend/lib/prisma";
import { isUserOnline } from "@/backend/socket/redis.service";

export const GET = withRole("ADMIN", async (_request: NextRequest) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      deviceSessions: {
        orderBy: { connectedAt: "desc" },
        take: 10,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const usersWithStatus = await Promise.all(
    users.map(async (user) => ({
      ...user,
      isOnline: await isUserOnline(user.id),
    }))
  );

  return successResponse(usersWithStatus);
});
