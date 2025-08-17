# Handscribe
A web app that lets you write on a digital board with mouse or pen and instantly converts your handwriting into a grayscale matrix, store it locally, and send it to a backend for further processing.

---

## Overview

- Users can draw on a canvas in the browser.
- Converts the handwritten input into a 512×512 grayscale matrix.
- Can store the matrix locally as CSV.
- Can send the matrix to a Node.js + Express backend, which saves it in JSON format with a label.
- Frontend: React
- Backend: Node.js + Express

---

## Frontend

### Project Structure
Frontend/
    HandwrittenImageToTextConverter/
        src/
        App.jsx
        components/
            CanvasBoard.jsx
            Controls.jsx
            RecognizedOutput.jsx
        utils/
            canvasUtils.jsx




### Component / Function Details

- **App.jsx**: Main component. Manages canvas reference, recognized matrix, and button handlers.
- **CanvasBoard.jsx**: Handles drawing on the canvas. Tracks mouse/touch input and renders strokes.
- **Controls.jsx**: Renders buttons: Recognize, Clear, Store, Send Matrix.
- **RecognizedOutput.jsx**: Displays recognized matrix (or sample) after clicking Recognize.
- **canvasUtils.jsx**:
  - `initCanvas(canvas, size, lineWidth)`: Initializes canvas with DPI scaling.
  - `clearCanvas(canvas, size)`: Clears canvas and fills with white.
  - `toGrayscaleMatrix(canvas, targetH, targetW)`: Converts canvas content into grayscale matrix.
  - `downloadCSV(matrix, filename)`: Saves matrix as CSV file locally.

### Usage

1. Draw on the canvas.
2. Click **Recognize** to see a sample of the matrix.
3. Click **Store** to save the matrix locally as CSV.
4. Click **Send Matrix** to send the matrix to the backend with a label.

---

## Backend

### Project Structure

Backend/
  server.js
  data/


### server.js

- **Endpoints**
  - `POST /upload-matrix`: Receives `{ label, matrix }` from frontend and saves it as a timestamped JSON file in `data/`.

- **JSON File Structure**
```json
{
  "y": "hello",
  "x": [[0.0, 0.0, ...], [0.0, 0.1, ...], ...]
}


Usage

Install dependencies:

npm install express fs


Ensure data/ folder exists in backend.

Start the server:

node server.js


Frontend should send requests to the backend URL, e.g.:

http://localhost:5000/upload-matrix

Notes

Frontend stores matrices locally as CSV (optional) and can also send to backend.

Backend stores matrices as JSON with label and timestamped filename.

Make sure CORS is configured if frontend and backend are on different ports.