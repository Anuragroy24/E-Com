import { body, param, query } from "express-validator";

export const productIdValidator = [
    param("id").isMongoId().withMessage("Invalid product id")
];

export const createProductValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Product name is required")
        .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters long"),

    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters long"),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a number >= 0"),

    body("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a whole number >= 0")
];

export const updateProductValidator = [
    ...productIdValidator,

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters long"),

    body("description")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters long"),

    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("Price must be a number >= 0"),

    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Stock must be a whole number >= 0")
];

export const listProductsValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];
