export default function StockBadge({ stock }) {
    let label = "In stock";
    let dot = "bg-forest-600";
    let text = "text-forest-700";

    if (stock === 0) {
        label = "Out of stock";
        dot = "bg-rust-600";
        text = "text-rust-700";
    } else if (stock <= 5) {
        label = "Low stock";
        dot = "bg-gold-600";
        text = "text-gold-700";
    }

    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}
