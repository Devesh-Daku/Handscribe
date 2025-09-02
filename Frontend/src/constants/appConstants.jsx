// src/constants/appConstants.jsx

export const CANVAS_CONFIG = {
  DEFAULT_SIZE: 512,
  DEFAULT_LINE_WIDTH: 3,
  DEFAULT_GUIDELINES: 5,
};

export const API_CONFIG = {
  // Read the base URL from the environment variables
  BASE_URL: import.meta.env.VITE_API_BASE_URL,

  ENDPOINTS: {
    API_RECOGNIZE: "/api/recognize/upload-matrix",
  },
};