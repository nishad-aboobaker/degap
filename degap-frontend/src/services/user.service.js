import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

const userService = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
    return response.data;
  },

  getPublicProfile: async (id) => {
    const response = await api.get(API_ENDPOINTS.USERS.PUBLIC_PROFILE(id));
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await api.put(API_ENDPOINTS.USERS.PASSWORD, data);
    return response.data;
  },
  
  updateEmail: async (data) => {
    const response = await api.put(API_ENDPOINTS.USERS.EMAIL, data);
    return response.data;
  },

  deleteAccount: async (password) => {
      // Typically requires password confirmation
      const response = await api.delete(API_ENDPOINTS.USERS.PROFILE, { data: { password } });
      return response.data;
  }
};

export default userService;
