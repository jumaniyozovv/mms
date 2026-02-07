export type UserRole = "ADMIN" | "MANAGER" | "USER";
export type DeviceType = "DESKTOP" | "MOBILE" | "TABLET" | "UNKNOWN";

export interface DeviceSession {
  id: string;
  socketId: string;
  browserName: string | null;
  browserVersion: string | null;
  osName: string | null;
  osVersion: string | null;
  deviceType: DeviceType;
  networkType: string | null;
  ipAddress: string | null;
  connectedAt: string;
  disconnectedAt: string | null;
}

export interface UserWithSessions {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  isOnline: boolean;
  deviceSessions: DeviceSession[];
}
