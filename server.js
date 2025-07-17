// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Express Middleware
app.use(cors());
app.use(express.json());

// REST API Routes
const routes = require("./routes");
app.use("/api", routes);

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: "*", // set this to frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Attach io to app locals (for use in controllers)
app.locals.io = io;

// Handle WebSocket connections
require("./sockets/socketHandler")(io); // move logic into a handler file

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("🔌 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
