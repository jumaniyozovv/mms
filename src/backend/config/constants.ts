export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: "3m",
  REFRESH_TOKEN_EXPIRY_HOURS: 1,
  BCRYPT_SALT_ROUNDS: 12,
  COOKIE_NAME: "refresh_token",
} as const;

export const ROLE_HIERARCHY: Record<string, number> = {
  ADMIN: 3,
  MANAGER: 2,
  USER: 1,
} as const;
