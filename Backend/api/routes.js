// backend/api/routes.js
import express from "express";
import { handleRecognitionRequest } from "./api/controller.js";

const router = express.Router();

// Defines the route POST /api/recognize/upload-matrix
router.post("/upload-matrix", handleRecognitionRequest);

export default router;