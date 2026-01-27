import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

const roadmapService = {
  getByCourseId: async (courseId) => {
    const response = await api.get(API_ENDPOINTS.ROADMAPS.BY_COURSE(courseId));
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ROADMAPS.DETAIL(id));
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.ROADMAPS.CREATE, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(API_ENDPOINTS.ROADMAPS.UPDATE(id), data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.ROADMAPS.DELETE(id));
    return response.data;
  },
};

export default roadmapService;
