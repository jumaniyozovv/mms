import { getRedis } from "@/backend/lib/redis";

const USER_ONLINE_PREFIX = "user_online:";
const SOCKET_SESSION_PREFIX = "socket_session:";
const SOCKET_SESSION_TTL = 3600; // 1 hour

export async function markUserOnline(
  userId: string,
  socketId: string,
  sessionId: string
): Promise<void> {
  const redis = getRedis();
  await redis.sadd(`${USER_ONLINE_PREFIX}${userId}`, socketId);
  await redis.hset(`${SOCKET_SESSION_PREFIX}${socketId}`, {
    userId,
    sessionId,
    lastSeenAt: new Date().toISOString(),
  });
  await redis.expire(`${SOCKET_SESSION_PREFIX}${socketId}`, SOCKET_SESSION_TTL);
}

export async function markSocketOffline(
  userId: string,
  socketId: string
): Promise<void> {
  const redis = getRedis();
  await redis.srem(`${USER_ONLINE_PREFIX}${userId}`, socketId);
  await redis.del(`${SOCKET_SESSION_PREFIX}${socketId}`);

  // Clean up the user online set if empty
  const remaining = await redis.scard(`${USER_ONLINE_PREFIX}${userId}`);
  if (remaining === 0) {
    await redis.del(`${USER_ONLINE_PREFIX}${userId}`);
  }
}

export async function isUserOnline(userId: string): Promise<boolean> {
  const redis = getRedis();
  const count = await redis.scard(`${USER_ONLINE_PREFIX}${userId}`);
  return count > 0;
}

export async function updateHeartbeat(socketId: string): Promise<void> {
  const redis = getRedis();
  await redis.hset(
    `${SOCKET_SESSION_PREFIX}${socketId}`,
    "lastSeenAt",
    new Date().toISOString()
  );
  await redis.expire(`${SOCKET_SESSION_PREFIX}${socketId}`, SOCKET_SESSION_TTL);
}

export async function getSocketSession(
  socketId: string
): Promise<{ userId: string; sessionId: string; lastSeenAt: string } | null> {
  const redis = getRedis();
  const data = await redis.hgetall(`${SOCKET_SESSION_PREFIX}${socketId}`);
  if (!data || !data.userId) return null;
  return data as { userId: string; sessionId: string; lastSeenAt: string };
}
