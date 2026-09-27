import { useState } from "react";
import { useNavigate, Link } from "react-router";
import useApi from "../../shared/useApi";
import BrandMark from "../../shared/BrandMark";

const Register = () => {
    const api = useApi();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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
            await api.post("/auth/register", form);
            navigate("/login", { state: { justRegistered: true } });
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                const errorsByField = {};
                data.errors.forEach((e) => { errorsByField[e.path] = e.message; });
                setFieldErrors(errorsByField);
            } else {
                setFormError(data?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-sm">
            <div className="flex flex-col items-center gap-2 text-center">
                <BrandMark className="h-9 w-9" />
                <h1 className="font-display text-2xl font-semibold text-ink">Create an account</h1>
                <p className="text-sm text-ink/60">Start listing and managing products.</p>
            </div>

            <div className="card-surface mt-6 p-8">
                {formError && <p className="banner-error mb-4">{formError}</p>}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="field-label">
                        Name
                        <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
                        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                    </label>

                    <label className="field-label">
                        Email
                        <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                    </label>

                    <label className="field-label">
                        Password
                        <input className="input-field" type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
                        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                    </label>

                    <label className="field-label">
                        Confirm password
                        <input className="input-field" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                        {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
                    </label>

                    <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full">
                        {isSubmitting ? "Creating account..." : "Register"}
                    </button>
                </form>
            </div>

            <p className="mt-6 text-center text-sm text-ink/60">
                Already have an account? <Link to="/login" className="font-medium text-forest-700 hover:underline">Log in</Link>
            </p>
        </div>
    );
};

export default Register;
