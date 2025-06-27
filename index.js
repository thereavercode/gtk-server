// index.js
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { sendReceiptSMS } = require("./sms"); // import your sms logic
const cors = require("cors");
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Payment endpoint
app.post("/pay", async (req, res) => {
  try {
    const { phone, amount, name } = req.body;

    if (!phone || !amount || !name) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    console.log("💸 Payment received:", req.body);

    const result = await sendReceiptSMS(phone, amount, name, "GTK-PAY");

    if (!result) {
      return res.status(500).json({ message: "SMS failed" });
    }

    return res.status(201).json({ message: "Payment processed successfully" });
  } catch (err) {
    console.error("💥 Error processing payment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Africa's Talking inbound SMS callback
app.post("/sms/callback", (req, res) => {
  const { from, text, to, id, date } = req.body;
  console.log(
    `📥 Incoming SMS: From ${from} to ${to}: "${text}" @ ${date} (ID: ${id})`
  );
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
