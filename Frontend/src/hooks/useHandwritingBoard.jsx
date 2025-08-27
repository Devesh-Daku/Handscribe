// src/hooks/useHandwritingBoard.jsx
import { useState, useRef } from 'react';
import { clearCanvas, toGrayscaleMatrix, downloadCSV } from '../utils/canvasUtils';
import { processMatrixForSending, sendMatrixToServer } from '../utils/matrixProcessor';
import { CANVAS_CONFIG } from '../constants/appConstants';

export const useHandwritingBoard = () => {
  const [recognized, setRecognized] = useState(null);
  const canvasRef = useRef(null);

  const handleRecognize = () => {
    const { MATRIX_DIMENSIONS } = CANVAS_CONFIG;
    const matrix = toGrayscaleMatrix(
      canvasRef.current, 
      MATRIX_DIMENSIONS.SAMPLE.width, 
      MATRIX_DIMENSIONS.SAMPLE.height
    );
    const sample = matrix.slice(0, 4).map((row) => row.slice(0, 8));
    setRecognized({ dims: [matrix.length, matrix[0].length], sample });
  };

  const handleClear = () => {
    clearCanvas(canvasRef.current, CANVAS_CONFIG.SIZE);
    setRecognized(null);
  };

  const handleStore = () => {
    const { MATRIX_DIMENSIONS } = CANVAS_CONFIG;
    const matrix = toGrayscaleMatrix(
      canvasRef.current, 
      MATRIX_DIMENSIONS.FULL.width, 
      MATRIX_DIMENSIONS.FULL.height
    );
    const label = window.prompt("Enter label/name for this drawing:");
    if (label) {
      downloadCSV(matrix, label);
    }
  };

  const handleSendMatrix = async () => {
    try {
      const dataToSend = processMatrixForSending(canvasRef.current);
      if (!dataToSend) return;

      const result = await sendMatrixToServer(dataToSend);
      alert(`Server response: ${result.message}`);
    } catch (err) {
      console.error('Error sending matrix to server:', err);
      alert("Failed to send split matrices to backend");
    }
  };

  return {
    recognized,
    canvasRef,
    handlers: {
      handleRecognize,
      handleClear,
      handleStore,
      handleSendMatrix
    }
  };
};
