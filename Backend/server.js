// backend/server.js
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const SAVE_DIR = path.join("./saved_matrices");
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR);

app.post("/upload-matrix", (req, res) => {
  const matrix = req.body;
  if (!matrix || Object.keys(matrix).length === 0)
    return res.status(400).json({ message: "Missing matrix" });

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timeStr = now
    .toTimeString()
    .split(" ")[0]
    .replace(/:/g, "-"); // HH-MM-SS
  const guidelineCount = Object.keys(matrix).length;

  const filename = `${dateStr}__${timeStr}__${guidelineCount}lines.json`;
  const filepath = path.join(SAVE_DIR, filename);

  fs.writeFile(filepath, JSON.stringify(matrix, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to save matrix" });
    }
    res.json({ message: `Matrix saved as ${filename}` });
  });
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
