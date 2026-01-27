import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/${token}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.put(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, { password });
    return response.data;
  },

  googleLogin: async (token) => {
      const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE, { token });
      return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  }
};

export default authService;
