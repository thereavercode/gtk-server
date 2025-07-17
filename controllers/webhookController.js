// controllers/webhookController.js
const { storePayments } = require("../services/payments");

exports.handleWebhook = async (req, res) => {
  try {
    const result = await storePayments(req.body);
    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(err.status || 500).send(err.message || "Server error");
  }
};
// This file handles incoming webhook requests, calling the service to store payment information.
// It catches errors and sends appropriate responses back to the client.
