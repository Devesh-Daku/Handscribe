// src/constants/appConstant.jsx
export const CANVAS_CONFIG = {
  SIZE: 512,
  LINE_WIDTH: 2,
  TOTAL_LINES: 5,
  PADDING: 10,
  MATRIX_DIMENSIONS: {
    FULL: { width: 512, height: 512 },
    SAMPLE: { width: 64, height: 64 }
  }
};

export const API_CONFIG = {
  BASE_URL: "http://localhost:5000",
  ENDPOINTS: {
    UPLOAD_MATRIX: "/upload-matrix",
    API_RECOGANIZED: "/api/recognize/upload-matrix"
  }
};
