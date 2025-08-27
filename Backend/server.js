// backend/server.js
import express from "express";
import cors from "cors";
import recognitionRoutes from "./api/routes.js"; // Import our new routes

const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Tell the app to use our routes for any URL starting with /api/recognize
app.use("/api/recognize", recognitionRoutes);

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);