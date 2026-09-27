import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
    createProductValidator,
    updateProductValidator,
    productIdValidator,
    listProductsValidator
} from "../validators/product.validator.js";
import {
    createProduct,
    listProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", authenticate, createProductValidator, validate, createProduct);
router.get("/", listProductsValidator, validate, listProducts);
router.get("/:id", productIdValidator, validate, getProductById);
router.put("/:id", authenticate, updateProductValidator, validate, updateProduct);
router.delete("/:id", authenticate, productIdValidator, validate, deleteProduct);

export default router;
