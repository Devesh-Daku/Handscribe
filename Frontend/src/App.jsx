// src / App.jsx

import React from "react";
import CanvasBoard from "./components/CanvasBoard";
import Controls from "./components/Controls";
import RecognizedOutput from "./components/RecognizedOutput";
import { useHandwritingBoard } from "./hooks/useHandwritingBoard";
import { CANVAS_CONFIG } from "./constants/appConstants";
import "./App.css";

export default function App() {
  const { recognized, canvasRef, handlers } = useHandwritingBoard();
  const { handleRecognize, handleClear, handleStore, handleSendMatrix } = handlers;

  return (
    <div className="min-h-screen w-full flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Handwriting Board</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <CanvasBoard
          size={CANVAS_CONFIG.SIZE}
          lineWidth={CANVAS_CONFIG.LINE_WIDTH}
          onDrawEnd={(canvas) => (canvasRef.current = canvas)}
        />

        <div className="flex flex-col gap-3 min-w-[280px]">
          <Controls 
            onRecognize={handleRecognize} 
            onClear={handleClear} 
            onStore={handleStore} 
            onSend={handleSendMatrix}
          />
          <RecognizedOutput recognized={recognized} />
        </div>
      </div>
    </div>
  );
}
