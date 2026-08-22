import express from "express";
import { analyzeContent } from "../controllers/analysisController.js";
const router = express.Router();

router.post("/analyze", analyzeContent);

export default router;
