import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js"
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { verifyJWT, adminMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const getProducts = asyncHandler(async (req, res, next) => {

    const products = await Product.find();

    if (!products.length) {
        return next(new ApiError(404, "No products found!"))
    }

    res.status(200).json(new ApiResponse(200, "Products fetched successfully.", products))
})

const addProduct = asyncHandler(async (req, res, next) => {

    const { name, price, long_description, short_description } = req.body;

    if (!req.files || !req.files.main_image || req.files.main_image.length === 0) {
        throw new ApiError(400, "Main image is required!");
    }

    // Upload images to Cloudinary from disk storage
    const mainImageUrl = await uploadOnCloudinary(req.files.main_image[0].path)
    console.log("Main Image URL : ", mainImageUrl)

    let additionalImagesUrls = []
    if (req.files.additional_images && req.files.additional_images.length > 0) {
        additionalImagesUrls = await Promise.all(
            req.files.additional_images.map(file => uploadOnCloudinary(file.path))
        );
    }

    console.log("Additional Images URLs:", additionalImagesUrls);

    // Create a new product
    const newProduct = new Product({
        name,
        price,
        long_description,
        short_description,
        main_image: mainImageUrl,
        additional_images: additionalImagesUrls
    });

    await newProduct.save();
    res.status(201).json(new ApiResponse(201, "Product added successfully.", newProduct));
});

const updateProduct = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const product = await Product.findById(id)
    if (!product) {
        throw next(new ApiError(404, "Product not found!"));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(new ApiResponse(200, "Product updated successfully.", updatedProduct));

})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id)
    if (!product) {
        return next(new ApiError(404, "Product not found!"))
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200, "Product deleted successfully."));
})

export { getProducts, addProduct, updateProduct, deleteProduct }