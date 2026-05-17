import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/export", exportRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Kase Brothers API is running"
  });
});

// Serve client build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDist = path.join(__dirname, "..", "dist");
const clientPublic = path.join(__dirname, "public");

if (process.env.NODE_ENV === "production") {
  try {
    const fs = await import("fs");
    if (fs.existsSync(clientDist)) {
      app.use(express.static(clientDist));
      app.get("/*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
    } else if (fs.existsSync(clientPublic)) {
      app.use(express.static(clientPublic));
      app.get("/*", (_req, res) => res.sendFile(path.join(clientPublic, "index.html")));
    }
  } catch (err) {
    console.warn("Static file serving setup skipped:", err.message || err);
  }
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use((error, _req, res, _next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload too large"
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate order ID generated. Please retry."
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();