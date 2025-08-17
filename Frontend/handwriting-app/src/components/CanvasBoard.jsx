import React, { useEffect, useRef, useState } from "react";
import { initCanvas } from "../utils/canvasUtils";

export default function CanvasBoard({ size, lineWidth, onDrawEnd }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    initCanvas(canvasRef.current, size, lineWidth);
  }, [size, lineWidth]);

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

  return (
    <canvas
      ref={canvasRef}
      className="border rounded-2xl shadow-lg bg-white touch-none"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    />
  );
}
