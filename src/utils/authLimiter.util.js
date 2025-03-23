import rateLimit from "express-rate-limit";
import { ApiError } from "./ApiError.util.js";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: new ApiError(429, "Too many login attempts. Please try again later."),
});

export default authLimiter;