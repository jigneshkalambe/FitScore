import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, 400, "Name, email, and password are required");
        }

        if (password.length < 6) {
            return errorResponse(res, 400, "Password must be at least 6 characters");
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return errorResponse(res, 409, "An account with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = generateToken(user._id);

        return successResponse(res, 201, "Account created successfully", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, "Email and password are required");
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        const token = generateToken(user._id);

        return successResponse(res, 200, "Login successful", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        return successResponse(res, 200, "User fetched successfully", {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        });
    } catch (err) {
        next(err);
    }
};

export { register, login, getMe };
