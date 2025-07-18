// controllers/paymentController.js
const { storePayments } = require("../services/payments");
const { generateFakePayment } = require("../utils/fakeData");

exports.handleWebhook = async (req, res) => {
  try {
    // Decide to use fake or real data based on query param
    const data = req.query.dummy === "true" ? generateFakePayment() : req.body;

    const result = await storePayments(data);

    // Emit transaction event
    const io = req.app.get("io");
    if (io) {
      io.emit("transaction", {
        transactionId: result.bankReference,
        amount: result.amountPaid,
        billNumber: result.billNumber,
        timestamp: new Date().toISOString(),
        status: "success",
      });
    }

    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(err.status || 500).send(err.message || "Server error");
  }
};

exports.handlePayment = async (req, res) => {
  try {
    const data = req.query.dummy === "true" ? generateFakePayment() : req.body;

    const result = await storePayments(data);

    // Emit transaction event
    const io = req.app.get("io");
    if (io) {
      io.emit("transaction", {
        transactionId: result.bankReference,
        amount: result.amountPaid,
        billNumber: result.billNumber,
        timestamp: new Date().toISOString(),
        status: "success",
      });
    }

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Payment error:", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};
// This file handles incoming webhook requests and payment processing.
// It can use either real or fake data based on a query parameter.
