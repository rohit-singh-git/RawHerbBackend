import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

const app = express()
dotenv.config()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json({ limit: "50kb" }))
app.use(express.urlencoded({ extended: true, limit: "50kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"

app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)

export default app