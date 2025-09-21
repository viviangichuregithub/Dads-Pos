"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current authenticated user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      return res.data.user; // can be used for role-based routing
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      throw new Error(msg);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      router.push("/auth/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Optional: helper for role-based routing
  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
