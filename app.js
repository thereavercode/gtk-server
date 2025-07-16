const express = require("express");
const cors = require("cors");
const path = require("path");

const distPath = path.resolve(__dirname, "../gtk-client/dist");

const equityRoutes = require("./routes/equityRoutes");
const { handlePayment } = require("./controllers/payment");
const { handleInboundSMS } = require("./services/sms");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Resolved dist path:", distPath);

// API Routes
app.use("/api/equity", equityRoutes);
app.post("/pay", handlePayment);
app.post("/sms/callback", handleInboundSMS);

// Serve static assets
app.use(express.static(distPath));

// React Router fallback for client-side routing
app.get("*", (req, res) => {
  const indexPath = path.resolve(distPath, "index.html");
  console.log("✅ Serving index.html from:", indexPath);
  res.sendFile(indexPath);
});

// Log all routes registered
if (app._router && app._router.stack) {
  app._router.stack
    .filter((r) => r.route)
    .forEach((r) => {
      const methods = Object.keys(r.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`🛣️  [${methods}] Route registered: ${r.route.path}`);
    });
} else {
  console.warn("Router stack not initialized yet.");
}

module.exports = app;
