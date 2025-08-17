// Backend/server.js
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
  const { label, matrix } = req.body;
  if (!label || !matrix) return res.status(400).json({ message: "Missing label or matrix" });

  const timestamp = Date.now();
  const filename = `${timestamp}.json`;
  const dataToSave = { y: label, x: matrix, timestamp };

  fs.writeFile(`${SAVE_DIR}/${filename}`, JSON.stringify(dataToSave, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to save matrix" });
    }
    res.json({ message: `Matrix saved as ${filename}` });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
