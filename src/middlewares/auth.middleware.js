import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return next(new ApiError(401, "Unauthorized request! No token provided!"))
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return next(new ApiError(401, "Invalid access token! User not found."));
        }

        req.user = user
        next()

    } catch (error) {
        return next(new ApiError(401, "Invalid access token! Token verification failed."));
    }
})

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return next(new ApiError(403, "Access Forbidden! Admin privileges required."));
    }
    next()
}

export { verifyJWT, adminMiddleware }