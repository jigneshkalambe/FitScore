import { errorResponse } from "../utils/responseHandler.js";

const analyzeContent = async (req, res) => {
    try {
        const { resumeText, jdText } = req.body;

        // Basic input validation
        if (!resumeText || !jdText) {
            return errorResponse(res, 400, "Resume text and job description are required");
        }

        // Check API key exists before even trying
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing in environment variables");
            return errorResponse(res, 500, "Server configuration error. Please try again later");
        }

        const result = await analyzeResumeMatch(resumeText, jdText);

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

export { analyzeContent };
