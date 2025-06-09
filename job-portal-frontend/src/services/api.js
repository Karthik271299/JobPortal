import axios from "axios";
import { getToken, refreshToken, logout } from "./authService";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh & errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try token refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        const token = getToken();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        logout(); // Clear auth and redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // You can add more global error handling here, e.g. show toast messages

    return Promise.reject(error);
  }
);

export default api;
