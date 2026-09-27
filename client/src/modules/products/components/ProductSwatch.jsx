import { gradientFromString } from "../../shared/colorFromString";

/**
 * Stands in for a product photo: a gradient block carrying the
 * product's first initial. Deterministic per product name, so the
 * same product always gets the same look.
 */
export default function ProductSwatch({ name, className = "" }) {
    const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";
    const gradient = gradientFromString(name);

    return (
        <div
            className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
        >
            <span className="font-display text-4xl font-medium text-white/90">{initial}</span>
        </div>
    );
}
