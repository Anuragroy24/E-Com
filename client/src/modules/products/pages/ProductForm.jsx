import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import useApi from "../../shared/useApi";

export default function ProductForm({ mode }) {
    const api = useApi();
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(mode === "edit");

    useEffect(() => {
        if (mode !== "edit") return;

        async function fetchProduct() {
            try {
                const res = await api.get(`/products/${id}`);
                const product = res.data.data.product;
                setForm({
                    name: product.name,
                    description: product.description || "",
                    price: product.price,
                    stock: product.stock
                });
            } catch (err) {
                setFormError("Could not load this product");
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, mode]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFieldErrors({});
        setFormError("");
        setIsSubmitting(true);

        const payload = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock)
        };

        try {
            if (mode === "create") {
                const res = await api.post("/products", payload);
                navigate(`/products/${res.data.data.product._id}`);
            } else {
                await api.put(`/products/${id}`, payload);
                navigate(`/products/${id}`);
            }
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

    if (isLoading) return <p className="text-center text-sm text-ink/50">Loading...</p>;

    return (
        <div className="mx-auto max-w-md">
            <Link to="/" className="text-sm font-medium text-ink/50 hover:text-ink">
                ← Back to products
            </Link>

            <div className="card-surface mt-4 p-8">
                <h1 className="font-display text-2xl font-semibold text-ink">
                    {mode === "create" ? "Add a product" : "Edit product"}
                </h1>

                {formError && <p className="banner-error mt-4">{formError}</p>}

                <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="field-label">
                        Name
                        <input className="input-field" name="name" value={form.name} onChange={handleChange} />
                        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                    </label>

                    <label className="field-label">
                        Description
                        <textarea
                            className="input-field"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                        />
                        {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="field-label">
                            Price
                            <input
                                className="input-field"
                                type="number"
                                step="0.01"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                            />
                            {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
                        </label>

                        <label className="field-label">
                            Stock
                            <input
                                className="input-field"
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                            />
                            {fieldErrors.stock && <span className="field-error">{fieldErrors.stock}</span>}
                        </label>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full">
                        {isSubmitting ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
