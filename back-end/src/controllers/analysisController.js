import { errorResponse, successResponse } from "../utils/responseHandler.js";
import { analyzeResumeMatch } from "../services/geminiService.js";
import Analysis from "../models/Analysis.js";

const analyzeContent = async (req, res) => {
    try {
        const { resumeText, jdText } = req.body;

        // Basic input validation
        if (!resumeText || !jdText) {
            return errorResponse(res, 400, "Resume text and job description are required");
        }

        if (jdText.trim().length < 100) {
            return errorResponse(res, 422, "This doesn't look like a complete job description. Please paste the full JD including required skills and responsibilities.");
        }

        // Check API key exists before even trying
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing in environment variables");
            return errorResponse(res, 500, "Server configuration error. Please try again later");
        }

        let result = await analyzeResumeMatch(resumeText, jdText);

        if (!result.missingSkills || result.missingSkills.length === 0) {
            console.warn("missingSkills came back empty — retrying with higher thinking level");
            result = await analyzeResumeMatch(resumeText, jdText, "medium");
        }

        return successResponse(res, 200, "Analysis completed successfully", result);
    } catch (err) {
        console.log("Error during analysis:", err);
        console.error("Gemini analysis error:", err.message);

        // Detect rate limit errors (Gemini returns 429 status)
        if (err.message.includes("429") || err.message.toLowerCase().includes("rate limit")) {
            return errorResponse(res, 429, "Too many requests right now. Please try again in a minute");
        }

        // Detect JSON parsing failure from our own service
        if (err.message.includes("Failed to parse Gemini response")) {
            return errorResponse(res, 502, "AI returned an unexpected response. Please try again");
        }

        // Fallback for anything else
        return errorResponse(res, 500, "Something went wrong while analyzing. Please try again");
    }
};

const saveAnalysis = async (req, res, next) => {
    try {
        const { label, jdText, score, matchedSkills, missingSkills, summary } = req.body;
        const userId = req.user._id;

        if (!jdText || score === undefined || !matchedSkills || !missingSkills || !summary) {
            return errorResponse(res, 400, "Missing required fields for saving analysis");
        }

        const analysis = new Analysis({
            userId,
            label,
            jdText,
            score,
            matchedSkills,
            missingSkills,
            summary,
        });

        await analysis.save();

        return successResponse(res, 201, "Analysis saved successfully", analysis);
    } catch (err) {
        next(err);
    }
};

const getHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const history = await Analysis.find({ userId }).sort({ createdAt: -1 });

        return successResponse(res, 200, "Analysis history retrieved successfully", history);
    } catch (error) {
        next(error);
    }
};

const getHistoryById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const analysisId = req.params.id;

        const analysis = await Analysis.findOne({ _id: analysisId });

        if (!analysis) {
            return errorResponse(res, 404, "Analysis not found");
        }

        if (analysis.userId.toString() !== userId.toString()) {
            return errorResponse(res, 403, "You do not have permission to access this analysis");
        }
        return successResponse(res, 200, "Analysis retrieved successfully", analysis);
    } catch (error) {
        next(error);
    }
};

const deleteHistoryById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const analysisId = req.params.id;

        const analysis = await Analysis.findOne({ _id: analysisId });

        if (!analysis) {
            return errorResponse(res, 404, "Analysis not found");
        }

        if (analysis.userId.toString() !== userId.toString()) {
            return errorResponse(res, 403, "You do not have permission to access this analysis");
        }

        await Analysis.deleteOne({ _id: analysisId });
        return successResponse(res, 200, "Analysis deleted successfully");
    } catch (err) {
        next(err);
    }
};

export { analyzeContent, saveAnalysis, getHistory, getHistoryById, deleteHistoryById };
