import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import useApi from "../../shared/useApi";
import { useAuthContext } from "../../auth/context/AuthProvider";
import ProductSwatch from "../components/ProductSwatch";
import StockBadge from "../components/StockBadge";

export default function ProductDetail() {
    const { id } = useParams();
    const api = useApi();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.data.product);
                setStatus("ready");
            } catch (err) {
                setStatus("error");
            }
        }

        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function handleDelete() {
        setDeleteError("");
        try {
            await api.delete(`/products/${id}`);
            navigate("/");
        } catch (err) {
            setDeleteError(err.response?.data?.message || "Could not delete product");
        }
    }

    if (status === "loading") {
        return <p className="text-center text-sm text-ink/50">Loading...</p>;
    }
    if (status === "error") {
        return <p className="banner-error mx-auto max-w-md text-center">Product not found.</p>;
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Link to="/" className="text-sm font-medium text-ink/50 hover:text-ink">
                ← Back to products
            </Link>

            <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <ProductSwatch name={product.name} className="h-64 w-full rounded-2xl sm:h-full" />

                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-semibold text-ink">{product.name}</h1>
                        <div className="mt-2 flex items-center gap-3">
                            <span className="text-2xl font-semibold text-gold-700">₹{product.price}</span>
                            <StockBadge stock={product.stock} />
                        </div>
                    </div>

                    <p className="text-sm leading-relaxed text-ink/70">
                        {product.description || "No description provided."}
                    </p>

                    <p className="text-sm text-ink/50">{product.stock} units in stock</p>

                    {deleteError && <p className="banner-error">{deleteError}</p>}

                    {user && (
                        <div className="mt-2 flex items-center gap-4">
                            <Link to={`/products/${id}/edit`} className="btn-outline">
                                Edit
                            </Link>
                            <button onClick={handleDelete} className="btn-danger-ghost">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
