// src/utils/matrixProcessor.jsx
import { toGrayscaleMatrix } from './canvasUtils';
import { API_CONFIG } from '../constants/appConstants';

// Now accepts guideline count as a parameter
export const processMatrixForSending = (canvas, totalLines, padding) => {
  if (!canvas) return null;

  const canvasSize = canvas.width; // Use actual canvas dimension
  const fullMatrix = toGrayscaleMatrix(canvas, canvasSize, canvasSize);
  const segmentHeight = Math.floor(canvasSize / totalLines);
  const dataToSend = {};

  for (let i = 0; i < totalLines; i++) {
    const key = `line_${i + 1}`;
    let start = i * segmentHeight;
    let end = start + segmentHeight;

    // Slicing logic for overlapping segments
    const sliceStart = Math.max(0, start - padding);
    const sliceEnd = Math.min(canvasSize, end + padding);
    
    dataToSend[key] = fullMatrix.slice(sliceStart, sliceEnd);
  }

  return dataToSend;
};

// API call function remains the same
export const sendMatrixToServer = async (dataToSend) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API_RECOGNIZE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to process request.' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};