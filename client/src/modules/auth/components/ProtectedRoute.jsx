import { Navigate } from "react-router";
import { useAuthContext } from "../context/AuthProvider";

/**
 * Wraps any page that requires a logged-in user. While the app is
 * still bootstrapping (trying the silent refresh on load) we show a
 * simple loading state instead of bouncing straight to /login.
 */
export default function ProtectedRoute({ children }) {
    const { user, isBootstrapping } = useAuthContext();

    if (isBootstrapping) {
        return <p className="text-center text-sm text-ink/50">Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
