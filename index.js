import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://frontend-virtualassistant-4q2s.vercel.app", // old deployed frontend
  "https://frontend-virtualassistant-6mjb.vercel.app"  // current deployed frontend
];

// ✅ CORS setup
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server requests
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// ✅ Preflight request handler
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("hi");
});

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectdb();
  console.log("Server connected on port", port);
});
