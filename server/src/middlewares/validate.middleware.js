import { validationResult } from "express-validator";

/**
 * Runs after an express-validator chain. If any validator in the chain
 * failed, respond with 400 + a field-level error list before the
 * request ever reaches the controller.
 */
export default function validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array().map((err) => ({
                path: err.path,
                message: err.msg
            }))
        });
    }

    next();
}
