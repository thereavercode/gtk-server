// backend/index.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const { setupSocket } = require("./sockets");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});

// Make io globally available
app.set("io", io);

// Init Socket.IO listeners
setupSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = server;
// Export the server for testing purposes
