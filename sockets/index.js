// backend/sockets/index.js

exports.setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected");

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected");
    });

    // You can add custom listeners here, e.g.
    // socket.on("pay", data => { ... });
  });
};
