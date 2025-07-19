import { storePayments } from "../services/payments.js";
import { generateFakePayment } from "../utils/fakeData.js";

const emitTransaction = (io, result) => {
  if (!io) return;
  io.emit("transaction", {
    transactionId: result.bankReference,
    amount: result.amountPaid,
    billNumber: result.billNumber,
    timestamp: new Date().toISOString(),
    status: "success",
  });
};

export const handleWebhook = async (req, res) => {
  try {
    const data =
      USE_DUMMY_DATA && req.query.dummy === "true"
        ? generateFakePayment()
        : req.body;
    const result = await storePayments(data);

    emitTransaction(req.app.get("io"), result);

    res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(err.status || 500).send(err.message || "Server error");
  }
};

export const handlePayment = async (req, res) => {
  try {
    const data =
      USE_DUMMY_DATA && req.query.dummy === "true"
        ? generateFakePayment()
        : req.body;
    const result = await storePayments(data);

    emitTransaction(req.app.get("io"), result);

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Payment error:", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
};
