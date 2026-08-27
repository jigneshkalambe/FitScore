import express from "express";
import { analyzeContent, deleteHistoryById, getHistory, getHistoryById, saveAnalysis } from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", analyzeContent);
router.post("/save", protect, saveAnalysis);
router.get("/history", protect, getHistory);
router.get("/history/:id", protect, getHistoryById);
router.delete("/history/:id", protect, deleteHistoryById);

export default router;
