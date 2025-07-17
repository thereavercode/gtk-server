//socketHandler.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  const useDummy = process.env.USE_DUMMY_DATA === "true";

  if (useDummy) {
    setInterval(() => {
      const dummyTransaction = {
        transactionId: Math.random().toString(36).substring(2, 10),
        amount: (Math.random() * 1000).toFixed(2),
        phone: "+2547" + Math.floor(Math.random() * 10000000),
        timestamp: new Date().toISOString(),
        status: "success",
        billNumber: "DUMMY123",
      };
      io.emit("transaction", dummyTransaction);
    }, 5000);
  }
};
// This file handles WebSocket connections and emits dummy transactions if configured.
// It listens for client connections and disconnections, and can emit real-time updates.
