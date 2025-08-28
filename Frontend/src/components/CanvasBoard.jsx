import React, { useEffect, useState, forwardRef } from "react";

const CanvasBoard = forwardRef(({
  size,
  tool,
  penSize,
  guidelines,
  showGuidelines,
  backgroundColor,
  history,
  onLineChange,
  onStrokeEnd,
  onDrawingStart,
}, ref) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeLine, setActiveLine] = useState({ current: null, previous: null });

  // This effect triggers recognition when the user moves to a new line
  useEffect(() => {
    if (activeLine.previous !== null && activeLine.current !== activeLine.previous) {
      onLineChange(activeLine.previous);
    }
  }, [activeLine, onLineChange]);

  // This effect handles all canvas setup and re-initialization.
  // This was the missing part from your snippet.
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
    if (showGuidelines) drawGuidelines(ctx);
    history.current = [];
  }, [size, guidelines, showGuidelines, backgroundColor, ref, history]);

  const saveState = () => {
    const canvas = ref.current;
    if (!canvas) return;
    if (history.current.length > 20) history.current.shift();
    history.current.push(canvas.toDataURL());
  };

  const drawGuidelines = (ctx) => {
    ctx.save();
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const PADDING_BOTTOM = 20;
    const usableHeight = size - PADDING_BOTTOM;
    const sectionHeight = usableHeight / guidelines;
    for (let i = 1; i <= guidelines; i++) {
      const y = i * sectionHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    ctx.restore();
  };
  
  const getCtx = () => ref.current.getContext("2d");

  const getPoint = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    saveState();
    const { y } = getPoint(e);

    const PADDING_BOTTOM = 20;
    const usableHeight = size - PADDING_BOTTOM;
    const sectionHeight = usableHeight / guidelines;
    const currentLineIndex = Math.min(guidelines - 1, Math.floor(y / sectionHeight));
    
    onDrawingStart(currentLineIndex);
    setActiveLine(prev => ({ current: currentLineIndex, previous: prev.current }));

    const ctx = getCtx();
    const { x } = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    ctx.lineWidth = penSize;
    ctx.strokeStyle = tool === 'eraser' ? backgroundColor : 'black';
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
    getCtx().closePath();
    onStrokeEnd(activeLine.current);
  };
  
  return (
    <canvas
      ref={ref}
      className="border-2 border-gray-300 rounded-lg shadow-md touch-none"
      style={{ backgroundColor: backgroundColor }}
      onMouseDown={onPointerDown} onMouseMove={onPointerMove} onMouseUp={onPointerUp} onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}
    />
  );
});

export default CanvasBoard;