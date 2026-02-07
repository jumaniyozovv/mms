import type { Server, Socket } from "socket.io";
import { UAParser } from "ua-parser-js";
import type { DeviceType } from "@/app/generated/prisma/client";
import { getRedis } from "@/backend/lib/redis";
import { socketAuthMiddleware, type SocketData } from "./auth";
import {
  markUserOnline,
  markSocketOffline,
  updateHeartbeat,
} from "./redis.service";
import {
  createDeviceSession,
  updateDeviceSessionDisconnect,
  updateSessionNetworkType,
} from "./session.service";

const USER_TOKENS_PREFIX = "user_tokens:";

type AppSocket = Socket<
  Record<string, (...args: unknown[]) => void>,
  Record<string, (...args: unknown[]) => void>,
  Record<string, never>,
  SocketData
>;

function resolveDeviceType(device: UAParser.IDevice): DeviceType {
  const type = device.type?.toLowerCase();
  if (type === "mobile") return "MOBILE";
  if (type === "tablet") return "TABLET";
  // ua-parser-js returns undefined type for desktops
  if (!type) return "DESKTOP";
  return "UNKNOWN";
}

function getClientIp(socket: AppSocket): string | undefined {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return socket.handshake.address || undefined;
}

async function handleConnection(socket: AppSocket): Promise<void> {
  const { user, userAgent } = socket.data;
  const userId = user.userId;

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();
  const deviceType = resolveDeviceType(device);
  const ipAddress = getClientIp(socket);

  // Create DB session (write #1)
  let session;
  try {
    session = await createDeviceSession({
      userId,
      socketId: socket.id,
      browserName: browser.name,
      browserVersion: browser.version,
      osName: os.name,
      osVersion: os.version,
      deviceType,
      ipAddress,
    });
  } catch (error) {
    console.error("[Socket] Failed to create device session:", error);
    socket.disconnect(true);
    return;
  }

  // Mark online in Redis
  await markUserOnline(userId, socket.id, session.id);

  // Join user room
  socket.join(`user:${userId}`);

  // Handle network type update
  socket.on("device:network", async (data: unknown) => {
    const payload = data as { networkType?: string };
    if (payload.networkType) {
      try {
        await updateSessionNetworkType(socket.id, payload.networkType);
      } catch (error) {
        console.error("[Socket] Failed to update network type:", error);
      }
    }
  });

  // Handle heartbeat
  socket.on("heartbeat", async () => {
    try {
      await updateHeartbeat(socket.id);

      // Check if user still has valid refresh tokens
      const redis = getRedis();
      const tokens = await redis.smembers(`${USER_TOKENS_PREFIX}${userId}`);
      if (tokens.length === 0) {
        socket.emit("session:expired");
        socket.disconnect(true);
      }
    } catch (error) {
      console.error("[Socket] Heartbeat error:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    try {
      await markSocketOffline(userId, socket.id);
      // Update DB session with disconnect time (write #2)
      await updateDeviceSessionDisconnect(socket.id);
    } catch (error) {
      console.error("[Socket] Disconnect cleanup error:", error);
    }
  });
}

export function initializeSocketHandlers(io: Server): void {
  io.use(socketAuthMiddleware as Parameters<typeof io.use>[0]);

  io.on("connection", (socket) => {
    handleConnection(socket as unknown as AppSocket).catch((error) => {
      console.error("[Socket] Connection handler error:", error);
      socket.disconnect(true);
    });
  });
}
