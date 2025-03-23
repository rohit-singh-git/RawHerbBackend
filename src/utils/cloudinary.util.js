import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import { ApiError } from './ApiError.util.js'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: "products"
        })

        console.log("Cloudinary Upload Result:", response);

        // console.log("File uploaded successfully.")
        // console.log(response.url)

        fs.unlinkSync(filePath)

        return response.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        throw new ApiError(500, "Failed to upload file to cloudinary", error)
    }
}

export { uploadOnCloudinary }