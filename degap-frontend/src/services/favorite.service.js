import api from "./api";

const API_URL = "/favorites";

const favoriteService = {
  toggleFavorite: async (courseId) => {
    const response = await api.post(`${API_URL}/toggle`, { courseId });
    return response.data;
  },
  checkFavorite: async (courseId) => {
    const response = await api.get(`${API_URL}/check/${courseId}`);
    return response.data;
  },
  getFavorites: async () => {
    const response = await api.get(API_URL);
    return response.data;
  },
};

export default favoriteService;
