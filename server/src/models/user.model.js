import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Name must be at least 3 characters long"],
            maxLength: [50, "Name must be at most 50 characters long"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
        passwordHash: {
            type: String,
            required: true,
            select: false
        },
        // We never store the raw refresh token - only its bcrypt hash.
        // This still lets us verify + revoke it, but a leaked DB dump
        // can't be replayed as a valid refresh token.
        refreshTokenHash: {
            type: String,
            default: null,
            select: false
        }
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
