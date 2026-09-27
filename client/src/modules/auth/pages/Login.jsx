import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import useApi from "../../shared/useApi";
import { useAuthContext } from "../context/AuthProvider";
import BrandMark from "../../shared/BrandMark";

const Login = () => {
    const api = useApi();
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFieldErrors({});
        setFormError("");
        setIsSubmitting(true);

        try {
            const response = await api.post("/auth/login", form);

            authContext.setAccessToken(response.data.accessToken);
            authContext.setUser(response.data.data.user);

            navigate("/profile");
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                const errorsByField = {};
                data.errors.forEach((e) => { errorsByField[e.path] = e.message; });
                setFieldErrors(errorsByField);
            } else {
                setFormError(data?.message || "Invalid email or password");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-sm">
            <div className="flex flex-col items-center gap-2 text-center">
                <BrandMark className="h-9 w-9" />
                <h1 className="font-display text-2xl font-semibold text-ink">Log in</h1>
                <p className="text-sm text-ink/60">Welcome back.</p>
            </div>

            <div className="card-surface mt-6 p-8">
                {location.state?.justRegistered && (
                    <p className="banner-success mb-4">Account created — please log in.</p>
                )}
                {formError && <p className="banner-error mb-4">{formError}</p>}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="field-label">
                        Email
                        <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                    </label>

                    <label className="field-label">
                        Password
                        <input className="input-field" type="password" name="password" value={form.password} onChange={handleChange} />
                        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                    </label>

                    <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full">
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>

            <p className="mt-6 text-center text-sm text-ink/60">
                New here? <Link to="/register" className="font-medium text-forest-700 hover:underline">Create an account</Link>
            </p>
        </div>
    );
};

export default Login;
