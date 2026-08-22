import multer from "multer";
import { errorResponse } from "../utils/responseHandler.js";

function errorHandler(err, req, res, next) {
    // Handle Multer-specific errors (file size, unexpected field, etc.)
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return errorResponse(res, 400, "File is too large. Maximum size is 5MB");
        }
        return errorResponse(res, 400, `Upload error: ${err.message}`);
    }

    // Handle our custom fileFilter rejection (thrown as a plain Error, not MulterError)
    if (err.message === "Only PDF and DOCX files are allowed") {
        return errorResponse(res, 400, err.message);
    }

    // Fallback for anything else that reaches here
    console.error("Unhandled error:", err);
    return errorResponse(res, 500, "Something went wrong. Please try again");
}

export default errorHandler;
