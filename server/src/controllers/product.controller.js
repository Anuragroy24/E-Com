import productModel from "../models/product.model.js";

/**
 * POST /api/products (authenticated)
 */
export async function createProduct(req, res) {
    const { name, description, price, stock } = req.body;

    const product = await productModel.create({
        name,
        description,
        price,
        stock,
        createdBy: req.user.id
    });

    res.status(201).json({
        message: "Product created successfully",
        data: { product }
    });
}

/**
 * GET /api/products (public, optional pagination via ?page=&limit=)
 */
export async function listProducts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        productModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        productModel.countDocuments()
    ]);

    res.status(200).json({
        message: "Products fetched successfully",
        data: {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    });
}

/**
 * GET /api/products/:id (public)
 */
export async function getProductById(req, res) {
    const product = await productModel.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
        message: "Product fetched successfully",
        data: { product }
    });
}

/**
 * PUT /api/products/:id (authenticated)
 * The :id is confirmed to exist before any update is attempted.
 */
export async function updateProduct(req, res) {
    const product = await productModel.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, stock } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    res.status(200).json({
        message: "Product updated successfully",
        data: { product }
    });
}

/**
 * DELETE /api/products/:id (authenticated)
 * The :id is confirmed to exist before any delete is attempted.
 */
export async function deleteProduct(req, res) {
    const product = await productModel.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({
        message: "Product deleted successfully",
        data: { product }
    });
}
