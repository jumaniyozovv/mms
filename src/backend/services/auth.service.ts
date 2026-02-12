import {
  findUserByEmail,
  findUserById,
  updateUserPassword,
  createUser,
} from "@/backend/repositories/user.repository";
import { getConfig } from "@/backend/repositories/day-off-config.repository";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} from "@/backend/repositories/refresh-token.repository";
import { comparePassword, hashPassword } from "@/backend/lib/password";
import {
  generateTokenPair,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from "@/backend/lib/jwt";
import type {
  AuthUser,
  AuthResult,
  JwtPayload,
  LoginCredentials,
  ChangePasswordInput,
} from "@/backend/types/auth.types";
import type { User } from "@/app/generated/prisma/client";

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone:string;
}

export async function canRegister(): Promise<boolean> {
  return true;
}

export async function register(
  input: RegisterInput
): Promise<{ authResult: AuthResult } | null> {
  // Check if email already exists
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    return null;
  }

  const hashedPassword = await hashPassword(input.password);
  const dayOffConfig = await getConfig();

  const user = await createUser({
    email: input.email,
    password: hashedPassword,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    role: "USER",
    paidDaysOff: dayOffConfig.paidDaysOff,
    sickDaysOff: dayOffConfig.sickDaysOff,
    personalDaysOff: dayOffConfig.personalDaysOff,
  });

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(payload);

  await createRefreshToken({
    token: tokens.refreshToken,
    userId: user.id,
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    authResult: {
      user: toAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<{ authResult: AuthResult} | null> {
  const user = await findUserByEmail(credentials.email);
  if (!user) return null;

  const isValidPassword = await comparePassword(
    credentials.password,
    user.password
  );
  if (!isValidPassword) return null;

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(payload);

  await createRefreshToken({
    token: tokens.refreshToken,
    userId: user.id,
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    authResult: {
      user: toAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  };
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenRecord = await findRefreshToken(refreshToken);
  if (tokenRecord) {
    await revokeRefreshToken(refreshToken);
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; newRefreshToken: string } | null> {
  const tokenRecord = await findRefreshToken(refreshToken);
  if (!tokenRecord) return null;

  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return null;
  }

  const user = await findUserById(payload.userId);
  if (!user) return null;

  await revokeRefreshToken(refreshToken);

  const newPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(newPayload);

  await createRefreshToken({
    token: tokens.refreshToken,
    userId: user.id,
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    accessToken: tokens.accessToken,
    newRefreshToken: tokens.refreshToken,
  };
}

export async function getCurrentUser(userId: string): Promise<AuthUser | null> {
  const user = await findUserById(userId);
  if (!user) return null;
  return toAuthUser(user);
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput
): Promise<boolean> {
  const user = await findUserById(userId);
  if (!user) return false;

  const isValidPassword = await comparePassword(
    input.currentPassword,
    user.password
  );
  if (!isValidPassword) return false;

  const hashedPassword = await hashPassword(input.newPassword);
  await updateUserPassword(userId, hashedPassword);

  await revokeAllUserRefreshTokens(userId);

  return true;
}
