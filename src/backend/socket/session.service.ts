import { prisma } from "@/backend/lib/prisma";
import type { DeviceType } from "@/app/generated/prisma/client";

interface CreateSessionInput {
  userId: string;
  socketId: string;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
  deviceType: DeviceType;
  ipAddress?: string;
}

export async function createDeviceSession(input: CreateSessionInput) {
  return prisma.deviceSession.create({
    data: {
      userId: input.userId,
      socketId: input.socketId,
      browserName: input.browserName ?? null,
      browserVersion: input.browserVersion ?? null,
      osName: input.osName ?? null,
      osVersion: input.osVersion ?? null,
      deviceType: input.deviceType,
      ipAddress: input.ipAddress ?? null,
    },
  });
}

export async function updateDeviceSessionDisconnect(socketId: string) {
  return prisma.deviceSession.update({
    where: { socketId },
    data: { disconnectedAt: new Date() },
  });
}

export async function updateSessionNetworkType(
  socketId: string,
  networkType: string
) {
  return prisma.deviceSession.update({
    where: { socketId },
    data: { networkType },
  });
}

export async function getUserDeviceSessions(userId: string) {
  return prisma.deviceSession.findMany({
    where: { userId },
    orderBy: { connectedAt: "desc" },
  });
}
