import express from "express"
import "dotenv/config.js"
import { connectDB } from "./config/mongodb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.route.js";
import cors from "cors"

const app = express()

app.use(cookieParser());
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));

connectDB()

const port = process.env.PORT || 5000

app.get("/", (req, res)=>{
    res.send("API Working ...")
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, ()=>{
    console.log(`Server Started @ Port ${port}`);  
})