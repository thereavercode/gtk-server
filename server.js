// backend/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: "*", // ideally set to frontend domain in production
    methods: ["GET", "POST"],
  },
});

// Emit dummy transaction every 5 seconds
setInterval(() => {
  const dummyTransaction = {
    transactionId: Math.random().toString(36).substring(2, 10),
    amount: (Math.random() * 1000).toFixed(2),
    phone: "+2547" + Math.floor(Math.random() * 10000000),
    timestamp: new Date().toISOString(),
    status: "success",
  };
  io.emit("transaction", dummyTransaction);
}, 5000);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});
