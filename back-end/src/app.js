import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import rateLimit from "express-rate-limit";

const app = express();

app.set("trust proxy", 1); // trust first proxy hop

app.use(cors());
app.use(express.json());

connectDB();

// Strict — protects your Gemini quota/cost
const analyzeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 analyze requests per IP per window
    message: { success: false, message: "Too many analysis requests. Please try again later." },
});

app.use("/api/analysis", analyzeLimiter, analysisRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
