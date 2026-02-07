import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redis;
}

// Prefix for refresh tokens
const REFRESH_TOKEN_PREFIX = "refresh_token:";
const USER_TOKENS_PREFIX = "user_tokens:";

// Refresh token TTL (7 days in seconds)
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

export interface StoredRefreshToken {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export async function storeRefreshToken(data: {
  token: string;
  userId: string;
  expiresAt: Date;
}): Promise<void> {
  const client = getRedis();
  const tokenData: StoredRefreshToken = {
    token: data.token,
    userId: data.userId,
    expiresAt: data.expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  // Store token data
  await client.setex(
    `${REFRESH_TOKEN_PREFIX}${data.token}`,
    REFRESH_TOKEN_TTL,
    JSON.stringify(tokenData)
  );

  // Add token to user's token set (for revoking all user tokens)
  await client.sadd(`${USER_TOKENS_PREFIX}${data.userId}`, data.token);
}

export async function getRefreshToken(
  token: string
): Promise<StoredRefreshToken | null> {
  const client = getRedis();
  const data = await client.get(`${REFRESH_TOKEN_PREFIX}${token}`);
  if (!data) return null;

  const tokenData = JSON.parse(data) as StoredRefreshToken;

  // Check if expired
  if (new Date(tokenData.expiresAt) < new Date()) {
    await deleteRefreshToken(token);
    return null;
  }

  return tokenData;
}

export async function deleteRefreshToken(token: string): Promise<void> {
  const client = getRedis();
  const data = await client.get(`${REFRESH_TOKEN_PREFIX}${token}`);
  if (data) {
    const tokenData = JSON.parse(data) as StoredRefreshToken;
    // Remove from user's token set
    await client.srem(`${USER_TOKENS_PREFIX}${tokenData.userId}`, token);
  }
  // Delete the token
  await client.del(`${REFRESH_TOKEN_PREFIX}${token}`);
}

export async function deleteAllUserRefreshTokens(userId: string): Promise<void> {
  const client = getRedis();
  // Get all tokens for user
  const tokens = await client.smembers(`${USER_TOKENS_PREFIX}${userId}`);

  if (tokens.length > 0) {
    // Delete all token data
    const tokenKeys = tokens.map((t) => `${REFRESH_TOKEN_PREFIX}${t}`);
    await client.del(...tokenKeys);
  }

  // Delete user's token set
  await client.del(`${USER_TOKENS_PREFIX}${userId}`);
}
