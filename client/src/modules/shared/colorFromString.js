// Deterministically maps a string (e.g. a product name) to one of a
// small set of pre-defined gradient classes. Tailwind needs the full
// class names to appear literally somewhere in the source for its
// scanner to include them in the build, so we enumerate them instead
// of building the strings dynamically.
const GRADIENTS = [
    "from-forest-500 to-forest-700",
    "from-gold-500 to-gold-700",
    "from-forest-600 to-gold-600",
    "from-gold-600 to-forest-700"
];

export function gradientFromString(value = "") {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % GRADIENTS.length;
    return GRADIENTS[index];
}
