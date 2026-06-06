import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import rateLimit from "express-rate-limit";

console.log("GitHub Routes Loaded");
dotenv.config();
connectDB();

const app = express();

const githubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: "Too many requests. Try again later",
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/github", githubLimiter, githubRoutes);

app.get("/", (req, res) => {
  res.send("Server running succussfully");
});

const PORT = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Working",
  });
});

app.listen(PORT, () => {
  console.log(`Sever is running on port : ${PORT}`);
});
