"use client";

import {useMe } from "@/features/auth/hooks";
import { AuthUser } from "@/features/auth/types";
import { createContext, useContext, type ReactNode } from "react";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useMe();


  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
