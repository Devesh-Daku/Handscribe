// src/utils/matrixProcessor.jsx
import { toGrayscaleMatrix } from './canvasUtils';
import { CANVAS_CONFIG, API_CONFIG } from '../constants/appConstants';

export const processMatrixForSending = (canvas) => {
  const { SIZE: canvasSize, TOTAL_LINES: totalLines, PADDING: padding } = CANVAS_CONFIG;
  
  if (!canvas) return null;

  const fullMatrix = toGrayscaleMatrix(canvas, canvasSize, canvasSize);
  const segmentHeight = Math.floor(canvasSize / totalLines);
  const dataToSend = {};

  for (let i = 0; i < totalLines; i++) {
    let start = i * segmentHeight;
    let end = start + segmentHeight;

    // Apply padding logic
    if (i === 0) {
      // first line: pad top 10 zeros
      const padded = Array(padding).fill(Array(canvasSize).fill(0));
      dataToSend[`line${i + 1}`] = [...padded, ...fullMatrix.slice(start, end + padding)];
    } else if (i === totalLines - 1) {
      // last line: pad bottom 10 zeros
      dataToSend[`line${i + 1}`] = [...fullMatrix.slice(start - padding, end), ...Array(padding).fill(Array(canvasSize).fill(0))];
    } else {
      // middle lines: overlap 10px both top and bottom
      dataToSend[`line${i + 1}`] = fullMatrix.slice(start - padding, end + padding);
    }
  }

  return dataToSend;
};

export const sendMatrixToServer = async (dataToSend) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.API_RECOGANIZED}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
