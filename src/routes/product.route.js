import express from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, adminMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();

// Fetch all products
router.get("/", getProducts)

// Add a new product
router.post("/addProduct", verifyJWT, adminMiddleware, upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "additional_images", maxCount: 5 }
]), addProduct)

router.put("/updateProduct/:id", verifyJWT, adminMiddleware, updateProduct)
router.delete("/deleteProduct/:id", verifyJWT, adminMiddleware, deleteProduct)

export default router
