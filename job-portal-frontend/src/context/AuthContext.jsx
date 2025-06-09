import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../services/api";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

/**
 * AuthProvider handles authentication state and methods
 * Provides user info, login, logout, token refresh & automatic logout on expiry
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Save user and token to localStorage
  const saveAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  // Clear auth state and localStorage
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Login method
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      saveAuth(response.data.user, response.data.token);
      toast.success("Logged in successfully");
      setLoading(false);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  // Logout method
  const logout = useCallback(() => {
    clearAuth();
    toast.success("Logged out");
  }, []);

  // Token refresh method
  const refreshToken = useCallback(async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh-token", {
        token,
      });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch {
      logout();
      toast.error("Session expired. Please login again.");
      return null;
    }
  }, [token, logout]);

  // Auto logout on token expiry (e.g., every 15 minutes or token exp time)
  useEffect(() => {
    if (!token) return;

    // Parse JWT token to get expiry (assuming standard JWT)
    const parseJwt = (jwt) => {
      try {
        return JSON.parse(atob(jwt.split(".")[1]));
      } catch {
        return null;
      }
    };

    const jwtPayload = parseJwt(token);
    if (!jwtPayload?.exp) return;

    const expiryTime = jwtPayload.exp * 1000;
    const currentTime = Date.now();
    const timeout = expiryTime - currentTime;

    if (timeout <= 0) {
      logout();
      return;
    }

    // Set timeout to auto logout at token expiry
    const timerId = setTimeout(() => {
      logout();
      toast.error("Session expired. Please login again.");
    }, timeout);

    // Optional: refresh token 1 minute before expiry
    const refreshTimerId = setTimeout(() => {
      refreshToken();
    }, timeout - 60 * 1000);

    return () => {
      clearTimeout(timerId);
      clearTimeout(refreshTimerId);
    };
  }, [token, logout, refreshToken]);

  // Context value provided to components
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
