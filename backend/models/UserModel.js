import mongoose from "mongoose";


const UserModel = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["manager", "user"],
        default: "user",
        required: "true"
    },
}, { timestamps: true })
UserModel.pre('save', async function (next) {
    if (!this.isModified('password')) return;

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    } catch (error) {
        next(error);
    }
});

UserModel.methods.comparePassword = async function (loginGuess) {
    return await bcrypt.compare(loginGuess, this.password);
};
const User = mongoose.model('User', UserModel);
export default User;
