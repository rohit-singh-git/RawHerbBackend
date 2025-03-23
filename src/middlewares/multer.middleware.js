import multer from "multer";
import path from "path";
import fs from 'fs';
import { ApiError } from "../utils/ApiError.util.js";

const uploadDir = "./public/temp"

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true)
    }else{
        cb(new ApiError(400, "Please upload image files only!"), false)
    }
}

export const upload = multer({ storage, fileFilter })