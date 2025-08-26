import React, { useEffect, useRef, useState } from "react";
import { initCanvas } from "../utils/canvasUtils";

export default function CanvasBoard({ size, lineWidth, onDrawEnd, defaultGuidelines = 5 }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [guidelines, setGuidelines] = useState(defaultGuidelines);

  // Initialize canvas once
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = initCanvas(canvas, size, lineWidth);

    drawGuidelines(ctx, size, guidelines);
  }, []); // only once

  const drawGuidelines = (ctx, size, count) => {
    ctx.save();
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    
    // Add bottom padding (like a real notebook)
    const bottomPadding = 30;
    const usableSpace = size - bottomPadding;
    
    // Calculate section height: divide usable space by number of sections
    const sectionHeight = usableSpace / count;
    
    // Draw guidelines (count-1 lines to create count sections)
    for (let i = 1; i <= count; i++) {
      const y = i * sectionHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const getCtx = () => canvasRef.current.getContext("2d");
  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const ctx = getCtx();
    const { x, y } = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = getCtx();
    const { x, y } = getPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const onPointerUp = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    onDrawEnd(canvasRef.current);
  };

  const addGuideline = () => {
    const ctx = getCtx();
    
    // Clear the canvas and redraw with new guidelines
    ctx.clearRect(0, 0, size, size);
    
    // Reinitialize canvas settings
    initCanvas(canvasRef.current, size, lineWidth);
    
    // Draw new guidelines
    drawGuidelines(ctx, size, guidelines + 1);
    setGuidelines(guidelines + 1);
  };

  const removeGuideline = () => {
    if (guidelines <= 1) return; // Prevent going below 1
    
    const ctx = getCtx();
    
    // Clear the canvas and redraw with fewer guidelines
    ctx.clearRect(0, 0, size, size);
    
    // Reinitialize canvas settings
    initCanvas(canvasRef.current, size, lineWidth);
    
    // Draw new guidelines
    drawGuidelines(ctx, size, guidelines - 1);
    setGuidelines(guidelines - 1);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="border rounded-2xl shadow-lg bg-white touch-none"
        width={size}
        height={size}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      />
      <div className="flex gap-2 mt-2">
        <button 
          onClick={addGuideline} 
          className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
        >
          Add Guideline ({guidelines + 1})
        </button>
        <button 
          onClick={removeGuideline} 
          className="px-3 py-1 bg-red-200 rounded hover:bg-red-300"
          disabled={guidelines <= 1}
        >
          Remove Guideline ({guidelines - 1})
        </button>
      </div>
    </>
  );
}
