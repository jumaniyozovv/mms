import jwt from "jsonwebtoken";
import { AUTH_CONSTANTS } from "@/backend/config/constants";
import type { JwtPayload, TokenPair } from "@/backend/types/auth.types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: `${AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_HOURS}h`,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  return expiry;
}
