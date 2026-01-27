import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

const progressService = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.PROGRESS.ALL);
    return response.data;
  },

  getByCourseId: async (courseId) => {
    const response = await api.get(API_ENDPOINTS.PROGRESS.BY_COURSE(courseId), {
      suppressGlobalError: true,
    });
    return response.data;
  },

  startCourse: async (courseId) => {
    const response = await api.post(API_ENDPOINTS.PROGRESS.START, { courseId });
    return response.data;
  },

  updateStep: async (data) => {
    const response = await api.put(API_ENDPOINTS.PROGRESS.STEP, data);
    return response.data;
  },

  resetCourse: async (courseId) => {
    const response = await api.delete(API_ENDPOINTS.PROGRESS.RESET(courseId));
    return response.data;
  },
};

export default progressService;
