// src/utils/canvasUtils.jsx
export const initCanvas = (canvas, size, lineWidth) => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr); // scale to DPR

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // scale line width according to DPR
  ctx.lineWidth = lineWidth; // now this matches the prop value correctly
  ctx.strokeStyle = "black";

  return ctx; // return context for convenience
};


export const clearCanvas = (canvas, size) => {
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);
};

export const toGrayscaleMatrix = (canvas, targetH = 512, targetW = 512) => {
  const off = document.createElement("canvas");
  off.width = targetW;
  off.height = targetH;
  const octx = off.getContext("2d");

  octx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetW, targetH);

  const { data } = octx.getImageData(0, 0, targetW, targetH);
  const matrix = [];

  for (let y = 0; y < targetH; y++) {
    const row = [];
    for (let x = 0; x < targetW; x++) {
      const idx = (y * targetW + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const val = gray ; // black ≈ 1
      row.push(Number(val.toFixed(3)));
    }
    matrix.push(row);
  }
  return matrix;
};
// utils/canvasUtils.jsx

export const downloadCSV = (matrix, filename) => {
  const csvContent = matrix.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

