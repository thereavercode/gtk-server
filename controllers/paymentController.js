// controllers/paymentController.js
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

exports.handlePayment = async (req, res) => {
  try {
    const result = await storePayments(req.body);
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Payment error:", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};
// This file handles both webhook and frontend payment requests.
// It calls the service to store payment information and sends appropriate responses back to the client.
