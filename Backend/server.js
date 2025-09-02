// backend/server.js
import express from "express";
import cors from "cors";
import recognitionRoutes from "./api/routes.js";

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0'; // <-- Add this line

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/recognize", recognitionRoutes);

// --- MODIFIED THIS LINE ---
// Start the server and listen on the specified host
app.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`)
);