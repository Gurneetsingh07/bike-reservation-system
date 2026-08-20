import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserModel = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["manager", "user"],
            default: "user",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserModel.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const saltRounds = 10;

    this.password = await bcrypt.hash(
        this.password,
        saltRounds
    );
});

// Compare password during login
UserModel.methods.comparePassword = async function (loginGuess) {
    return await bcrypt.compare(
        loginGuess,
        this.password
    );
};

const User = mongoose.model("User", UserModel);

export default User;
