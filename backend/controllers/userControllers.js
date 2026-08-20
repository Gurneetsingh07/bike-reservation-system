import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const createToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};
const signup = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        const existingUSer = await User.findOne({ email });
        if (existingUSer) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }
        const user = await User.create({ email, password });
        return res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
const login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email" });
        }
        const token = createToken(user);
        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
            })
            .status(200)
            .json({
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
            });
    }
    catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
}
const logout = async (req, res) => {
    return res
        .clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        })
        .status(200)
        .json({
            message: "Logout successful",
        });
}


export {
    signup,
    login,
    logout
}