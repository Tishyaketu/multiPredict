import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/auth.routes.js'
import predictionRouter from './routes/prediction.routes.js'
import reportRouter from './routes/report.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/predict", predictionRouter)
app.use("/api/v1/report", reportRouter)

export { app }
