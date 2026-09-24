import axios from "axios";
import { getToken } from "./authService";

// Create a standardized axios instance with base URL from .env
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_ROUTE,
});

// Add interceptor to include authentication token in all requests except for auth endpoints
api.interceptors.request.use((config) => {
  // List of endpoints that don't need authentication token
  const noAuthEndpoints = [
    "/auth/register",
    "/auth/register-clinic",
    "/auth/login",
    "/auth/forgot-password",
    "/auth/validate-token",
    "/auth/reset-password",
    "/doctor/search",
  ];

  // Check if the current request URL is in the noAuthEndpoints list
  const isAuthEndpoint = noAuthEndpoints.some(
    (endpoint) => config.url && config.url.includes(endpoint),
  );

  // Only add the token if it's not an auth endpoint
  if (!isAuthEndpoint) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
