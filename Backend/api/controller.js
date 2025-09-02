// backend/api/controller.js
import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import axios from "axios";
import FormData from "form-data";

const OUTPUT_DIR = path.resolve("./output"); 
const MATRICES_SUBDIR = path.join(OUTPUT_DIR, "matrices");
const IMAGES_SUBDIR = path.join(OUTPUT_DIR, "images");
// const PYTHON_EXECUTABLE = path.resolve("./venv/Scripts/python.exe"); 
const PYTHON_EXECUTABLE = "python3"; 
const PYTHON_SCRIPT_PATH = path.resolve("./operations.py"); 
// const MODEL_API_URL = "http://127.0.0.1:8000/predict/"; // Local development
const MODEL_API_URL = 'https://handscribe.onrender.com/predict';

// This function processes a single line
async function processLine(lineKey, matrix) {
  const matrixFilePath = path.join(MATRICES_SUBDIR, `matrix_${lineKey}.json`);
  const imageFilePath = path.join(IMAGES_SUBDIR, `image_${lineKey}.png`);

  await fs.writeFile(matrixFilePath, JSON.stringify(matrix));
  console.log(`Matrix for ${lineKey} saved to: ${matrixFilePath}`);

  await new Promise((resolve, reject) => {
    const pythonProcess = spawn(PYTHON_EXECUTABLE, [PYTHON_SCRIPT_PATH, matrixFilePath, imageFilePath]);
    let errorData = "";
    pythonProcess.stderr.on("data", (data) => (errorData += data.toString()));
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        console.log(`Image for ${lineKey} created at: ${imageFilePath}`);
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}. Error: ${errorData}`));
      }
    });
  });

  const imageStream = await fs.readFile(imageFilePath);
  const form = new FormData();
  form.append("image", imageStream, { filename: path.basename(imageFilePath) });
  
  console.log(`Sending request to Model API for ${lineKey}...`);
  const response = await axios.post(MODEL_API_URL, form);
  
  const { recognized_text } = response.data;
  console.log(`✅ Result for ${lineKey}: '${recognized_text}'`);
  return { id: lineKey, text: recognized_text };
}

// This is the main controller function that the route will call
export const handleRecognitionRequest = async (req, res) => {
  const matrices = req.body;
  if (!matrices || Object.keys(matrices).length === 0) {
    return res.status(400).json({ message: "Missing matrix data" });
  }

  await fs.mkdir(MATRICES_SUBDIR, { recursive: true });
  await fs.mkdir(IMAGES_SUBDIR, { recursive: true });

  const processingPromises = Object.entries(matrices).map(([lineKey, matrix]) =>
    processLine(lineKey, matrix).catch(error => {
      console.error(`❌ Top-level error for ${lineKey}:`, error.message);
      return { id: lineKey, text: `[Error: See backend logs]` };
    })
  );

  try {
    const unorderedResults = await Promise.all(processingPromises);
    const sortedResults = unorderedResults.sort((a, b) => {
        const numA = parseInt(a.id.split('_')[1] || 0);
        const numB = parseInt(b.id.split('_')[1] || 0);
        return numA - numB;
    });

    console.log("All processing complete. Sending final response to frontend.");
    res.json(sortedResults);
  } catch (error) {
    res.status(500).json({ message: "A critical error occurred." });
  }
};