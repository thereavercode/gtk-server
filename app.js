// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { ipKeyGenerator } = require("express-rate-limit");
const rateLimit = require("express-rate-limit");

const paymentRoutes = require("./routes/paymentRoutes");
const equityRoutes = require("./routes/equityRoutes");
const { handlePayment } = require("./controllers/paymentController");
const { handleInboundSMS } = require("./services/sms");
const basicAuthMiddleware = require("./middleware/basicAuthMiddleware");

const app = express();
//const distPath = path.resolve(__dirname, "dist");
//console.log("✅ Resolved dist path:", distPath);

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.set("trust proxy", 1); // Trust 1st proxy (e.g., ngrok/render)

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

// Serve Static Frontend
//app.use(express.static(distPath));

// Public Routes (no auth)
app.use("/", paymentRoutes);

// Protected API Routes
app.use("/api", basicAuthMiddleware); // middleware protects all /api/* endpoints
app.use("/api/equity", equityRoutes);
app.post("/pay", handlePayment);
app.post("/sms/callback", handleInboundSMS);

// SPA Fallback (for React Router, etc.)
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

module.exports = app;
