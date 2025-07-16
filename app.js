const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const equityRoutes = require("./routes/equityRoutes");
const { handlePayment } = require("./controllers/payment");
const { handleInboundSMS } = require("./services/sms");
const basicAuthMiddleware = require("./middleware/basicAuthMiddleware"); // ✅ new import

const app = express();

const distPath = path.resolve(__dirname, "dist");
console.log("✅ Resolved dist path:", distPath);

// Security headers
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Static frontend (unprotected)
app.use(express.static(distPath));

// ✅ Protected API routes
app.use("/api", basicAuthMiddleware);
app.use("/api/equity", equityRoutes);
app.post("/pay", basicAuthMiddleware, handlePayment);
app.post("/sms/callback", basicAuthMiddleware, handleInboundSMS);

// SPA fallback
app.get(/^\/(?!api|static|assets).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

module.exports = app;
// This file sets up the Express server with security, body parsing, rate limiting, and routing.
