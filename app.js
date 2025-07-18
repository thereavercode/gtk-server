import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ipKeyGenerator } from "express-rate-limit";
import rateLimit from "express-rate-limit";

import paymentRoutes from "./routes/paymentRoutes.js";
import equityRoutes from "./routes/equityRoutes.js";
import { handlePayment } from "./controllers/paymentController.js";
import { handleInboundSMS } from "./services/sms.js";
import basicAuthMiddleware from "./middleware/basicAuthMiddleware.js";

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req, res) => {
    if (req.query.apiKey) return req.query.apiKey;
    const ipv6Subnet = 64;
    return ipKeyGenerator(req.ip, ipv6Subnet);
  },
});

app.use(limiter);

// Serve Static Frontend (uncomment and adjust if needed)
// import path from "path";
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// const distPath = path.resolve(__dirname, "dist");
// app.use(express.static(distPath));

// Public Routes (no auth)
app.use("/", paymentRoutes);

// Protected API Routes
app.use("/api", basicAuthMiddleware); // middleware protects all /api/* endpoints
app.use("/api/equity", equityRoutes);
app.post("/pay", handlePayment);
app.post("/sms/callback", handleInboundSMS);

// SPA Fallback (for React Router, etc., uncomment and adjust if used)
// app.get(/^\/(?!api|static|assets).*/, (req, res) => {
//   res.sendFile(path.join(distPath, "index.html"));
// });

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

export default app;
// This file sets up the Express application with security, rate limiting, and routes.
