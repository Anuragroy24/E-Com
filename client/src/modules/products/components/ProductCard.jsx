import { Link } from "react-router";
import ProductSwatch from "./ProductSwatch";
import StockBadge from "./StockBadge";

export default function ProductCard({ product }) {
    return (
        <Link
            to={`/products/${product._id}`}
            className="group card-surface flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            <ProductSwatch name={product.name} className="h-36 w-full" />

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-display text-base font-semibold text-ink group-hover:text-forest-700">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gold-700">₹{product.price}</span>
                    <StockBadge stock={product.stock} />
                </div>
            </div>
        </Link>
    );
}
