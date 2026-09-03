import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
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
                token: token,
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

const createUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role are required"
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const isValidEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

        if (!isValidEmail) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        })
        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword,
            role
        });
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (error) {
        console.error("Create user error:", error);

        return res.status(500).json({
            message: "Failed to create user"
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            email,
            password,
            role
        } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (email !== undefined) {

            const normalizedEmail =
                email.trim().toLowerCase();

            const isValidEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    normalizedEmail
                );
            if (!isValidEmail) {
                return res.status(400).json({
                    message: "Invalid email"
                });
            }
            const existingUser = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: id }
            });
            if (existingUser) {
                return res.status(409).json({
                    message: "Another user already has this email"
                });
            }
            user.email = normalizedEmail;
        }
        if (password !== undefined) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters"
                });
            }
            user.password = await bcrypt.hash(
                password,
                10
            );
        }
        if (role !== undefined) {

            if (!["user", "manager"].includes(role)) {
                return res.status(400).json({
                    message: "Role must be either user or manager"
                });
            }
            user.role = role;
        }
        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Update user error:", error);

        return res.status(500).json({
            message: "Failed to update user"
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        await User.findByIdAndDelete(id);
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            message: "Failed to delete user"
        });
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "email role createdAt updatedAt").sort({
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};
export {
    signup,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    getUsers
}