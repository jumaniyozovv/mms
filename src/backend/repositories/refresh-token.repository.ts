import {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  deleteAllUserRefreshTokens,
  type StoredRefreshToken,
} from "@/backend/lib/redis";

export async function createRefreshToken(data: {
  token: string;
  userId: string;
  expiresAt: Date;
}): Promise<void> {
  await storeRefreshToken(data);
}

export async function findRefreshToken(
  token: string
): Promise<StoredRefreshToken | null> {
  return getRefreshToken(token);
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await deleteRefreshToken(token);
}

export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await deleteAllUserRefreshTokens(userId);
}
