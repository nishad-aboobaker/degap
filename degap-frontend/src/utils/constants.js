// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    GOOGLE: "/auth/google",
    GITHUB: "/auth/github",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    PUBLIC_PROFILE: (id) => `/users/${id}`,
    SETTINGS: "/users/settings",
    PASSWORD: "/users/password",
    EMAIL: "/users/email",
  },
  COURSES: {
    LIST: "/courses",
    SEARCH: "/courses/search",
    DETAIL: (id) => `/courses/${id}`,
    CREATE: "/courses",
    UPDATE: (id) => `/courses/${id}`,
    DELETE: (id) => `/courses/${id}`,
    FAVORITE: (id) => `/courses/${id}/favorite`,
    MY_COURSES: "/courses/my-courses",
    MY_FAVORITES: "/courses/my-favorites",
    ADD_CO_OWNER: (id) => `/courses/${id}/co-owner`,
    REMOVE_CO_OWNER: (id, userId) => `/courses/${id}/co-owner/${userId}`,
  },
  ROADMAPS: {
    BY_COURSE: (courseId) => `/roadmaps/course/${courseId}`,
    DETAIL: (id) => `/roadmaps/${id}`,
    CREATE: "/roadmaps",
    UPDATE: (id) => `/roadmaps/${id}`,
    DELETE: (id) => `/roadmaps/${id}`,
  },
  PROGRESS: {
    ALL: "/progress",
    START: "/progress/start",
    BY_COURSE: (courseId) => `/progress/course/${courseId}`,
    STEP: "/progress/step",
    RESET: (courseId) => `/progress/course/${courseId}`,
  },
  SUBMISSIONS: {
    CREATE: "/submissions",
    MY_SUBMISSIONS: "/submissions/my-submissions",
    DETAIL: (id) => `/submissions/${id}`,
    UPDATE: (id) => `/submissions/${id}`,
  },
  ADMIN: {
    USERS: "/admin/users",
    USER_DETAIL: (id) => `/admin/users/${id}`,
    USER_STATUS: (id) => `/admin/users/${id}/status`,
    SUBMISSIONS: "/admin/submissions",
    SUBMISSION_DETAIL: (id) => `/admin/submissions/${id}`,
    APPROVE_SUBMISSION: (id) => `/admin/submissions/${id}/approve`,
    REJECT_SUBMISSION: (id) => `/admin/submissions/${id}/reject`,
    REQUEST_CHANGES: (id) => `/admin/submissions/${id}/request-changes`,
    TAKEDOWN_COURSE: (id) => `/admin/courses/${id}/takedown`,
    ANALYTICS: "/admin/analytics",
  },
};

// User Roles
export const ROLES = {
  STUDENT: "student",
  CONTRIBUTOR: "contributor",
  ADMIN: "admin",
};

// Course Status
export const COURSE_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  TAKEN_DOWN: "taken_down",
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};

