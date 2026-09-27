import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import {
    generateTokens,
    verifyRefreshToken,
    hashToken,
    compareToken,
    refreshCookieOptions
} from "../utils/auth.js";

/**
 * POST /api/auth/register
 * Creates a user account only. No tokens are issued here - the user
 * must log in separately, per the assignment spec.
 */
export async function register(req, res) {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            message: "User already exists",
            errors: [{ path: "email", message: "An account with this email already exists" }]
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({ name, email, passwordHash });

    res.status(201).json({
        message: "User registered successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
}

/**
 * POST /api/auth/login
 * Verifies credentials, then issues:
 *  - an access token  -> returned in the JSON body
 *  - a refresh token  -> set as an httpOnly cookie, and its bcrypt
 *    hash is persisted on the user so it can be revoked later.
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+passwordHash");

    // Generic message on purpose - never reveal whether it was the
    // email or the password that was wrong.
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens({ userId: user._id });

    user.refreshTokenHash = await hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions());

    res.status(200).json({
        message: "Logged in successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        },
        accessToken
    });
}

/**
 * POST /api/auth/refresh-token
 * Reads the refresh token cookie, checks it against the hash stored
 * for that user, and if it matches issues a brand new access token
 * plus a rotated refresh token (old one is immediately invalidated).
 */
export async function refreshAccessToken(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized, refresh token not found" });
    }

    try {
        const decoded = verifyRefreshToken(incomingRefreshToken);

        const user = await userModel.findById(decoded.id).select("+refreshTokenHash");

        const isValidRefreshToken = user && (await compareToken(incomingRefreshToken, user.refreshTokenHash));

        if (!isValidRefreshToken) {
            // Either the token was reused after rotation, or it doesn't
            // belong to this user any more - force a full re-login.
            if (user) {
                user.refreshTokenHash = null;
                await user.save();
            }
            res.clearCookie("refreshToken", refreshCookieOptions());
            return res.status(403).json({ message: "Unauthorized, refresh token is invalid or was reused" });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens({ userId: user._id });

        user.refreshTokenHash = await hashToken(newRefreshToken);
        await user.save();

        res.cookie("refreshToken", newRefreshToken, refreshCookieOptions());

        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        });
    } catch (err) {
        res.clearCookie("refreshToken", refreshCookieOptions());
        return res.status(401).json({ message: "Unauthorized, invalid or expired refresh token" });
    }
}

/**
 * POST /api/auth/logout
 * Deletes the stored refresh token hash so it can never be used
 * again, and clears the cookie on the client.
 */
export async function logout(req, res) {
    await userModel.findByIdAndUpdate(req.user.id, { refreshTokenHash: null });

    res.clearCookie("refreshToken", refreshCookieOptions());

    res.status(200).json({ message: "Logged out successfully" });
}

/**
 * GET /api/auth/me
 */
export async function getProfile(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User fetched successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    });
}
