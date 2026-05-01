/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { get, post } from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check

  // ── Fetch current user on mount ──────────────────────────────────────────
  const checkAuth = useCallback(async () => {
    try {
      const data = await get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const signup = async (userData) => {
    const data = await post("/auth/signup", userData);
    return data;
  };

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async ({ identifier, password }) => {
    const data = await post("/auth/login", { identifier, password });
    setUser(data.user);
    return data;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await post("/auth/logout");
    } catch {
      // ignore — clear client state regardless
    }
    setUser(null);
  };

  // ── Update Profile ───────────────────────────────────────────────────────
  const updateProfile = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/users/me/update`;
    const res = await fetch(url, {
      method: "PUT",
      credentials: "include",
      body: formData, // FormData — browser sets Content-Type
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");
    setUser(data.user || data.data); // Handle both 'user' and 'data' response keys
    return data;
  };

  const value = {
    user,
    setUser,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
