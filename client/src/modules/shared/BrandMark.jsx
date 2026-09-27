/**
 * A small geometric mark for the "ShopCRUD" wordmark - two overlapping
 * shapes referencing a price tag, in the forest/gold palette.
 */
export default function BrandMark({ className = "h-7 w-7" }) {
    return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
            <rect x="4" y="4" width="16" height="16" rx="4" className="fill-forest-600" />
            <rect x="13" y="13" width="15" height="15" rx="4" className="fill-gold-500" />
        </svg>
    );
}
