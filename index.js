
// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import connectdb from "./config/db.js";
// import cookieParser from "cookie-parser";
// import cors from 'cors'
// import authRouter from "./routes/auth.routes.js";
// const app=express();
// app.use(cors({origin:"https://localhost:5173",
//   credentials:true
// }))
// const port=process.env.PORT || 5000;
// app.use(express.json())
// app.use(cookieParser())
// app.use("/api/auth", authRouter)
// app.get("/",(req,res)=>{
//   res.send("hi");
// })
// app.listen(port,()=>{
//   connectdb()
//   console.log("server connected")

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();
 // origin: "https://frontend-virtualassistant.onrender.com",
  // credentials: true
app.use(cors({
  origin: [
    "http://localhost:5173",                            // local dev
    "https://frontend-virtualassistant1.onrender.com",  // alternate live frontend
    "https://frontend-virtualassistant.onrender.com"    // main live frontend
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);  // <- mount user routes

app.get("/", (req, res) => {
  res.send("hi");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectdb();
  console.log("Server connected on port", port);
});
