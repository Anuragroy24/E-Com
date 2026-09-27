import { useEffect, useState } from "react";
import { Link } from "react-router";
import useApi from "../../shared/useApi";
import { useAuthContext } from "../../auth/context/AuthProvider";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
    const api = useApi();
    const { user } = useAuthContext();
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await api.get("/products");
                setProducts(res.data.data.products);
                setStatus("ready");
            } catch (err) {
                setStatus("error");
            }
        }

        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-semibold text-ink">Products</h1>
                    <p className="mt-1 text-sm text-ink/60">Everything currently listed in the catalog.</p>
                </div>
                {user && (
                    <Link to="/products/new" className="btn-primary">
                        Add product
                    </Link>
                )}
            </div>

            {status === "loading" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card-surface h-64 animate-pulse overflow-hidden">
                            <div className="h-36 w-full bg-sand-200" />
                            <div className="space-y-2 p-4">
                                <div className="h-4 w-2/3 rounded bg-sand-200" />
                                <div className="h-4 w-1/3 rounded bg-sand-200" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {status === "error" && (
                <p className="banner-error">Could not load products right now.</p>
            )}

            {status === "ready" && products.length === 0 && (
                <div className="card-surface flex flex-col items-center gap-3 px-6 py-16 text-center">
                    <p className="font-display text-xl font-semibold text-ink">No products yet</p>
                    <p className="max-w-sm text-sm text-ink/60">
                        Once something is added to the catalog, it'll show up here.
                    </p>
                    {user && (
                        <Link to="/products/new" className="btn-primary mt-2">
                            Add the first one
                        </Link>
                    )}
                </div>
            )}

            {status === "ready" && products.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
