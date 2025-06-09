import api from "./api";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Save tokens to localStorage
export const setTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Get access token from localStorage
export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// Get refresh token from localStorage
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Remove tokens from localStorage
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Login API call
export const login = async (credentials) => {
  // credentials = { email, password }
  const response = await api.post("/auth/login", credentials);
  if (response.data?.accessToken && response.data?.refreshToken) {
    setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    });
  }
  return response.data;
};

// Register API call
export const registerUser = async (userData) => {
  // userData = { firstName, lastName, email, password, ... }
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Refresh token API call
export const refreshToken = async () => {
  const token = getRefreshToken();
  if (!token) throw new Error("No refresh token available");

  const response = await api.post("/auth/refresh", { refreshToken: token });
  if (response.data?.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
    return response.data.accessToken;
  } else {
    throw new Error("Failed to refresh token");
  }
};

// Logout: Clear tokens and optionally inform backend
export const logout = async () => {
  try {
    const refresh = getRefreshToken();
    if (refresh) {
      await api.post("/auth/logout", { refreshToken: refresh });
    }
  } catch (err) {
    console.warn("Logout API failed:", err);
  } finally {
    clearTokens();
  }
};
