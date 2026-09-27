// In dev, Vite proxies /api to localhost:3000 (see vite.config.js), so
// the relative path works with no env var needed. In production
// (Vercel) there is no proxy, so VITE_API_BASE_URL must point at the
// deployed backend, e.g. https://your-app.onrender.com/api
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
