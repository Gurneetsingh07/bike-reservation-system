import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token is required",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User does not exist",
            });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You are not allowed to perform this action",
            });
        }

        next();
    };
};

export { authenticate, authorizeRoles };