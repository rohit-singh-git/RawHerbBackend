import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    price: {
        type: Number,
        required: true
    },

    long_description: {
        type: String,
        required: true
    },

    short_description: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    main_image: {
        type: String,
    },

    additional_images: [
        {
            type: String
        }
    ]

}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)
