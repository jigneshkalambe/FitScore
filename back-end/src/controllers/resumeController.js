import { extractTextFromFile } from "../services/parserService.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";

const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return errorResponse(res, 400, "No file uploaded. Please attach a resume (PDF or DOCX)");
        }

        const { buffer, mimetype, originalname } = req.file;

        let extractedText;
        try {
            extractedText = await extractTextFromFile(buffer, mimetype);
        } catch (err) {
            if (err.message === "Unsupported file type") {
                return errorResponse(res, 415, "Unsupported file type. Please upload a PDF or DOCX file");
            }
            throw err; // genuine unexpected errors still goes to the global handler
        }

        // Guard against empty/garbled extraction
        if (!extractedText || extractedText.trim().length < 20) {
            return errorResponse(res, 422, "Could not extract readable text from this file. Try a different file or paste your resume text manually");
        }

        return successResponse(res, 200, "Resume parsed successfully", {
            fileName: originalname,
            extractedText,
        });
    } catch (err) {
        next(err);
    }
};

export { uploadResume };
