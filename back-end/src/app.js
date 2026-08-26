import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/analysis", analysisRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
