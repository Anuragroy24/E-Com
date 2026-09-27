import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/config.js";

/**
 * Generates a fresh access + refresh token pair for a given user.
 * - access token  -> short lived, sent back in the JSON body
 * - refresh token -> long lived, sent back as an httpOnly cookie
 */
export const generateTokens = ({ userId }) => {
    const accessToken = jwt.sign({ id: userId }, config.ACCESS_TOKEN_SECRET, {
        expiresIn: config.ACCESS_TOKEN_EXPIRY
    });

    const refreshToken = jwt.sign({ id: userId }, config.REFRESH_TOKEN_SECRET, {
        expiresIn: config.REFRESH_TOKEN_EXPIRY
    });

    return { accessToken, refreshToken };
};

export function verifyAccessToken(token) {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
}

// The DB only ever stores a bcrypt hash of the refresh token (never the
// raw token itself), so we need helpers to hash + compare it.
export async function hashToken(token) {
    return bcrypt.hash(token, 10);
}

export async function compareToken(token, hash) {
    if (!hash) return false;
    return bcrypt.compare(token, hash);
}

// Options used whenever we set/clear the refreshToken cookie, kept in one
// place so login / refresh / logout all stay in sync.
export function refreshCookieOptions() {
    return {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
}
