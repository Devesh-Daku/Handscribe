// src/constants/appConstants.jsx

export const CANVAS_CONFIG = {
  DEFAULT_SIZE: 512,
  DEFAULT_LINE_WIDTH: 3,
  DEFAULT_GUIDELINES: 5,
};

export const API_CONFIG = {
  BASE_URL: "http://192.168.0.101:5000",
  ENDPOINTS: {
    // Ensure this is the only endpoint defined and is named correctly
    API_RECOGNIZE: "/api/recognize/upload-matrix",
  },
};