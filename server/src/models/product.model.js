import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: [2, "Product name must be at least 2 characters long"],
            maxLength: [100, "Product name must be at most 100 characters long"]
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxLength: [1000, "Description must be at most 1000 characters long"]
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },
        stock: {
            type: Number,
            required: true,
            min: [0, "Stock cannot be negative"],
            default: 0
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
