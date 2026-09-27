import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }

    return context;
}

/**
 * Owns the two pieces of auth state for the whole app:
 *  - user         -> the logged-in user's profile (or null)
 *  - accessToken  -> kept ONLY in memory (React state), never localStorage,
 *                    so it disappears on a hard refresh - that's expected.
 *
 * The refresh token itself never touches JS: it lives in an httpOnly
 * cookie the browser sends automatically. So on first load we call
 * /api/auth/refresh-token once to silently mint a new access token
 * from that cookie (if one exists), which is what keeps a user logged
 * in across page reloads without ever exposing the refresh token to
 * client-side code.
 */
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        async function bootstrap() {
            try {
                const res = await axios.post(
                    "/api/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                setAccessToken(res.data.accessToken);

                const meRes = await axios.get("/api/auth/me", {
                    headers: { Authorization: `Bearer ${res.data.accessToken}` },
                    withCredentials: true
                });

                setUser(meRes.data.data.user);
            } catch (err) {
                // No valid refresh cookie yet (or it expired) - that's a
                // normal "logged out" state, not an error to surface.
                setUser(null);
                setAccessToken(null);
            } finally {
                setIsBootstrapping(false);
            }
        }

        bootstrap();
    }, []);

    function logoutLocally() {
        setUser(null);
        setAccessToken(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, setUser, accessToken, setAccessToken, isBootstrapping, logoutLocally }}
        >
            {children}
        </AuthContext.Provider>
    );
}
