import type { Socket } from "socket.io";
import { parse as parseCookie } from "cookie";
import { verifyAccessToken } from "@/backend/lib/jwt";
import type { JwtPayload } from "@/backend/types/auth.types";

export interface SocketData {
  user: JwtPayload;
  userAgent: string;
}

export function socketAuthMiddleware(
  socket: Socket<Record<string, never>, Record<string, never>, Record<string, never>, SocketData>,
  next: (err?: Error) => void
) {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("Authentication required"));
    }

    const cookies = parseCookie(cookieHeader);
    const token = cookies["access_token"];
    if (!token) {
      return next(new Error("Access token not found"));
    }

    const user = verifyAccessToken(token);
    socket.data.user = user;
    socket.data.userAgent = socket.handshake.headers["user-agent"] || "";
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
}
