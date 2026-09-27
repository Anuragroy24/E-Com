import { Link, Outlet, useNavigate } from "react-router";
import { useAuthContext } from "../modules/auth/context/AuthProvider";
import useApi from "../modules/shared/useApi";
import BrandMark from "../modules/shared/BrandMark";

export default function Layout() {
    const { user, isBootstrapping, logoutLocally } = useAuthContext();
    const api = useApi();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            // clear local state regardless, so the UI never gets stuck
        }
        logoutLocally();
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-sand-200 bg-paper/80 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <BrandMark />
                        <span className="font-display text-lg font-semibold text-ink">ShopCRUD</span>
                    </Link>

                    <nav className="flex items-center gap-6 text-sm font-medium text-ink/70">
                        <Link to="/" className="hover:text-ink">Products</Link>

                        {!isBootstrapping && user && (
                            <Link to="/products/new" className="hover:text-ink">Add product</Link>
                        )}
                        {!isBootstrapping && user && (
                            <Link to="/profile" className="hover:text-ink">Profile</Link>
                        )}
                        {!isBootstrapping && user && (
                            <button onClick={handleLogout} className="hover:text-rust-600">
                                Logout
                            </button>
                        )}
                        {!isBootstrapping && !user && (
                            <Link to="/login" className="hover:text-ink">Login</Link>
                        )}
                        {!isBootstrapping && !user && (
                            <Link to="/register" className="btn-primary !px-4 !py-2">Register</Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
                <Outlet />
            </main>

            <footer className="border-t border-sand-200 py-6 text-center text-xs text-ink/40">
                Built for the Authentication &amp; Product CRUD APIs assignment.
            </footer>
        </div>
    );
}
