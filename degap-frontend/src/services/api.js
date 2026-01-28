import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
}

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      window.dispatchEvent(
        new CustomEvent("degap:error", {
          detail: {
            message: "Network error. Please check your connection.",
            type: "error",
          },
        })
      );
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(API_ENDPOINTS.AUTH.LOGIN) &&
      !originalRequest.url.includes(API_ENDPOINTS.AUTH.REFRESH)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post(API_ENDPOINTS.AUTH.REFRESH);
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status >= 400 && status < 500) {
      // Skip global error for refresh token failures
      if (originalRequest.url.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        return Promise.reject(error);
      }

      // Skip global error for initial /auth/me checks (expected 401 when logged out)
      if (originalRequest.url.endsWith("/auth/me")) {
        return Promise.reject(error);
      }

      // Check for suppression flag
      if (originalRequest.suppressGlobalError) {
        return Promise.reject(error);
      }

      const message =
        error.response.data?.error?.message || "Request failed. Please try again.";
      window.dispatchEvent(
        new CustomEvent("degap:error", {
          detail: {
            message,
            type: "error",
          },
        })
      );
    }

    if (status >= 500) {
      window.dispatchEvent(
        new CustomEvent("degap:error", {
          detail: {
            message: "Server error. Please try again later.",
            type: "error",
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;

