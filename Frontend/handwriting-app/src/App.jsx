import React, { useState, useRef } from "react";
import CanvasBoard from "./components/CanvasBoard";
import Controls from "./components/Controls";
import RecognizedOutput from "./components/RecognizedOutput";
import { clearCanvas, toGrayscaleMatrix, downloadCSV } from "./utils/canvasUtils";
import "./App.css"
export default function App() {
  const CANVAS_SIZE = 512;
  const LINE_WIDTH = 4;

  const [recognized, setRecognized] = useState(null);
  const canvasRef = useRef(null);

  const handleRecognize = () => {
    const matrix = toGrayscaleMatrix(canvasRef.current, 64, 64);
    const sample = matrix.slice(0, 4).map((row) => row.slice(0, 8));
    setRecognized({ dims: [matrix.length, matrix[0].length], sample });
  };

  const handleClear = () => {
    clearCanvas(canvasRef.current, CANVAS_SIZE);
    setRecognized(null);
  };

  const handleStore = () => {
    const matrix = toGrayscaleMatrix(canvasRef.current, 512, 512);
    const label = window.prompt("Enter label/name for this drawing:");
    if (label) {
      downloadCSV(matrix, label);
    }
  };

  const handleSendMatrix = async () => {
    const matrix = toGrayscaleMatrix(canvasRef.current, 512, 512);
    const label = window.prompt("Enter label/name for this drawing:");
    if (!label) return;

    try {
      const response = await fetch("http://localhost:5000/upload-matrix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label, matrix }),
      });
      const data = await response.json();
      alert(`Server response: ${data.message}`);
    } catch (err) {
      console.error(err);
      alert("Failed to send matrix to backend");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Handwriting Board</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <CanvasBoard
          size={CANVAS_SIZE}
          lineWidth={LINE_WIDTH}
          onDrawEnd={(canvas) => (canvasRef.current = canvas)}
        />

        <div className="flex flex-col gap-3 min-w-[280px]">
          <Controls onRecognize={handleRecognize} onClear={handleClear} onStore={handleStore} onSend={handleSendMatrix}/>
          <RecognizedOutput recognized={recognized} />
        </div>
      </div>
    </div>
  );
}
