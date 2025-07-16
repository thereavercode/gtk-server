const express = require("express");
const cors = require("cors");
const path = require("path");

const equityRoutes = require("./routes/equityRoutes");
const { handlePayment } = require("./controllers/payment");
const { handleInboundSMS } = require("./services/sms");

const app = express();

const distPath = path.resolve(__dirname, "dist");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(distPath));

// API routes
app.use("/api/equity", equityRoutes);
app.post("/pay", handlePayment);
app.post("/sms/callback", handleInboundSMS);

// SPA fallback route
app.get(/^\/(?!api|static|assets).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Log registered routes AFTER all above routing setup
function logRoutes() {
  if (!app._router || !app._router.stack) {
    console.warn("⚠️ Router stack not initialized yet.");
    return;
  }

  app._router.stack
    .filter((layer) => layer.route)
    .forEach((layer) => {
      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`🛣️  [${methods}] Route registered: ${layer.route.path}`);
    });
}

logRoutes();

module.exports = app;
