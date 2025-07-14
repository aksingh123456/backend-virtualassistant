import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import authRouter from "./routes/auth.routes.js";
const app=express();
app.use(cors({origin:"https://localhost:5173",
  credentials:true
}))
const port=process.env.PORT || 5000;
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.get("/",(req,res)=>{
  res.send("hi");
})
app.listen(port,()=>{
  connectdb()
  console.log("server connected")
})
