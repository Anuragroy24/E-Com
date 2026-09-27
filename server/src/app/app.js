import "express-async-errors"; // lets async route/controller errors reach the error handler below
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "../config/config.js";
import authRoutes from "../routes/auth.routes.js";
import productRoutes from "../routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true
    })
);

app.get("/", (req, res) => {
    res.json({ message: "E-commerce Auth & Product CRUD API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Central error handler - catches anything thrown/rejected inside routes
app.use((err, req, res, next) => {
    console.error(err);

    // Mongo duplicate key error (e.g. a race on the unique email index)
    if (err.code === 11000) {
        return res.status(409).json({
            message: "User already exists",
            errors: [{ path: Object.keys(err.keyPattern || {})[0] || "field", message: "Must be unique" }]
        });
    }

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error"
    });
});

export default app;
