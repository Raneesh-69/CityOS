import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// ===============================
// CORS Configuration
// ===============================

const defaultAllowed = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

// Build allowed origins from defaults + env vars
let allowedOrigins = [...defaultAllowed];

if (process.env.DEPLOYED_ORIGIN) {
  allowedOrigins.push(process.env.DEPLOYED_ORIGIN);
}

if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  allowedOrigins = Array.from(new Set([...allowedOrigins, ...envOrigins]));
}

console.log("CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests like curl or server-to-server (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// ===============================
// Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.send("🚀 CityOS AI Backend Running...");
});

// ===============================
// MongoDB Connection
// ===============================

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();
