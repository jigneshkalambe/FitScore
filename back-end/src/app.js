import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analysis", analysisRoutes);
app.use("/api/resume", resumeRoutes);

app.use(errorHandler);

export default app;
