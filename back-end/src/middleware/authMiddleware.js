import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/responseHandler.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse(res, 401, "Not authorized. Please log in");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(res, 401, "User no longer exists");
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 401, "Invalid or expired token");
    }
};

export { protect };
