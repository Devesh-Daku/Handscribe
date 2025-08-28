// src/components/Controls/ToolSettings.jsx
import React from 'react';

export default function ToolSettings({ tool, setTool, penSize, setPenSize }) {
  return (
    <>
      {/* Tools */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Tool</label>
        <div className="flex gap-2">
          <button className={`flex-1 p-2 rounded ${tool === 'pen' ? 'bg-black text-white' : 'border'}`} onClick={() => setTool('pen')}>Pen</button>
          <button className={`flex-1 p-2 rounded ${tool === 'eraser' ? 'bg-black text-white' : 'border'}`} onClick={() => setTool('eraser')}>Eraser</button>
        </div>
      </div>

      {/* Pen/Eraser Size */}
      <div className="flex flex-col gap-2">
        {/* --- THIS LABEL IS NOW DYNAMIC --- */}
        <label htmlFor="sizeSlider" className="font-semibold capitalize">
          {tool} Size: {penSize}
        </label>
        <input
          type="range"
          id="sizeSlider"
          min="1"
          max="50" // Increased max size for eraser
          value={penSize}
          onChange={(e) => setPenSize(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </>
  );
}