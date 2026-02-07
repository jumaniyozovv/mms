"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = io({
      path: "/api/socket",
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);

      // Send initial network info
      const nav = navigator as Navigator & {
        connection?: { effectiveType?: string };
      };
      if (nav.connection?.effectiveType) {
        socket.emit("device:network", {
          networkType: nav.connection.effectiveType,
        });
      }

      // Start heartbeat
      heartbeatRef.current = setInterval(() => {
        socket.emit("heartbeat");
      }, 30_000);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    });

    socket.on("session:expired", () => {
      window.location.href = "/login";
    });

    // Listen for network type changes
    const nav = navigator as Navigator & {
      connection?: EventTarget & { effectiveType?: string };
    };
    function handleNetworkChange() {
      if (nav.connection?.effectiveType && socketRef.current?.connected) {
        socketRef.current.emit("device:network", {
          networkType: nav.connection.effectiveType,
        });
      }
    }
    nav.connection?.addEventListener("change", handleNetworkChange);

    return () => {
      nav.connection?.removeEventListener("change", handleNetworkChange);
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
