// src/hooks/useHandwritingBoard.jsx
import { useState, useRef, useCallback } from 'react';
import { processMatrixForSending, sendMatrixToServer } from '../utils/matrixProcessor';

const isMatrixEmpty = (matrix) => {
  if (!matrix || matrix.length === 0) return true;
  let sum = 0;
  for (let i = 0; i < matrix.length; i += 10) {
    for (let j = 0; j < matrix[i].length; j += 10) {
      if (matrix[i][j] < 250) sum += 1;
    }
  }
  return sum < 5;
};

const DEBOUNCE_DELAY = 1500; // 1.5 seconds

export const useHandwritingBoard = () => {
  const canvasRef = useRef(null);
  const history = useRef([]);
  const [lineResults, setLineResults] = useState({});
  const debounceTimers = useRef({});
  
  // --- NEW: Ref to track request generations for cancellation ---
  const requestGeneration = useRef(0);

  const triggerRecognitionForLine = useCallback(async (lineIndex, guidelines, padding) => {
    if (lineIndex === null || !canvasRef.current) return;

    // Capture the current request generation ID
    const currentGeneration = requestGeneration.current;
    
    const lineKey = `line_${lineIndex + 1}`;
    setLineResults(prev => ({ ...prev, [lineKey]: { text: null, isLoading: true } }));
    
    try {
      const allMatrices = processMatrixForSending(canvasRef.current, guidelines, padding);
      const matrixForLine = allMatrices[lineKey];

      if (isMatrixEmpty(matrixForLine)) {
        // Still check generation ID to prevent race conditions on clear
        if (currentGeneration === requestGeneration.current) {
          setLineResults(prev => ({ ...prev, [lineKey]: { text: '', isLoading: false } }));
        }
        return;
      }

      const dataToSend = { [lineKey]: matrixForLine };
      const apiResult = await sendMatrixToServer(dataToSend);
      
      // --- CRITICAL CHECK ---
      // Only update the state if the generation ID hasn't changed.
      // If the user clicked "Clear", the IDs won't match, and this result will be ignored.
      if (currentGeneration === requestGeneration.current && apiResult && apiResult[0]) {
        const { id, text } = apiResult[0];
        setLineResults(prev => ({ ...prev, [id]: { text, isLoading: false } }));
      }

    } catch (err) {
      console.error(`Error recognizing line ${lineKey}:`, err);
      // Also check generation ID before showing an error
      if (currentGeneration === requestGeneration.current) {
        setLineResults(prev => ({ ...prev, [lineKey]: { text: '[Error]', isLoading: false } }));
      }
    }
  }, []);

  const handleLineChange = useCallback((prevLineIndex, guidelines, padding) => {
    clearTimeout(debounceTimers.current[prevLineIndex]);
    triggerRecognitionForLine(prevLineIndex, guidelines, padding);
  }, [triggerRecognitionForLine]);

  const handleStrokeEnd = useCallback((currentLineIndex, guidelines, padding) => {
    clearTimeout(debounceTimers.current[currentLineIndex]);
    debounceTimers.current[currentLineIndex] = setTimeout(() => {
      triggerRecognitionForLine(currentLineIndex, guidelines, padding);
    }, DEBOUNCE_DELAY);
  }, [triggerRecognitionForLine]);

  const handleDrawingStart = useCallback((currentLineIndex) => {
    clearTimeout(debounceTimers.current[currentLineIndex]);
  }, []);

  const handleClear = useCallback((backgroundColor) => {
    // --- CRITICAL CHANGE ---
    // Invalidate all previous requests by creating a new generation ID
    requestGeneration.current++;

    // Clear all pending timers
    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};

    // Clear the UI
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    history.current = [];
    setLineResults({});
  }, []);

  const handleUndo = useCallback((backgroundColor) => {
    // (Undo logic is unchanged)
    if (history.current.length > 0) {
      history.current.pop();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (history.current.length > 0) {
            ctx.drawImage(img, 0, 0);
        }
      };
      if (history.current.length > 0) {
        img.src = history.current[history.current.length - 1];
      } else {
        handleClear(backgroundColor);
      }
    }
  }, [handleClear]);

  return {
    canvasRef,
    history,
    lineResults,
    handlers: { handleLineChange, handleStrokeEnd, handleDrawingStart, handleClear, handleUndo },
  };
};