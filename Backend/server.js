// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recognitionRoutes from "./api/routes.js";

// Load environment variables from the .env file
dotenv.config();

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0';

// --- CORS Configuration ---
// Create a list of allowed origins (URLs)
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,       // Your local frontend
  process.env.FRONTEND_URL_PROD       // Your production frontend (set on Render)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, or curl)
    if (!origin) return callback(null, true);

    // If the origin is in our allowed list, allow it.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Otherwise, block it.
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// --- Middleware Setup ---
app.use(cors(corsOptions)); // Use the flexible CORS options
app.use(express.json({ limit: "50mb" }));

// --- Routes ---
app.use("/api/recognize", recognitionRoutes);

// --- Server Startup ---
app.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`)
);