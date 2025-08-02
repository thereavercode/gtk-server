import express from "express";
import app from "./app.js"; // add .js extension for ESM
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // or just './routes.js' if single file
import socketHandler from "./sockets/socketHandler.js";

dotenv.config();

const server = http.createServer(app);

// Express Middleware
app.use(cors());
app.use(express.json());

// REST API Routes
app.use("/api", routes);

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: "https://gtk-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you need to allow cookies/auth headers
  },
});

// Attach io to app locals (for use in controllers)
app.locals.io = io;

// Handle WebSocket connections
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("🔌 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
