// gtk-server/index.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const { setupSocket } = require("./sockets");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// ✅ WebSocket setup with open CORS (can be secured further)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make io globally available
app.set("io", io);

// Initialize socket listeners
setupSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = server;
// This file initializes the server, sets up WebSocket connections, and starts listening on the specified port.
