"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * Custom hook to access authentication context
 * Provides: user, loading, login, logout, isAdmin
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
