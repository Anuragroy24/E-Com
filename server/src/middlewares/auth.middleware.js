import { verifyAccessToken } from "../utils/auth.js";

/**
 * Protects a route: reads the Bearer access token from the
 * Authorization header, verifies it, and attaches req.user.
 * Any route that needs a logged-in user sits behind this.
 */
export default function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!accessToken) {
        return res.status(401).json({
            message: "Unauthorized, access token not found"
        });
    }

    try {
        const decoded = verifyAccessToken(accessToken);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized, invalid or expired access token"
        });
    }
}
