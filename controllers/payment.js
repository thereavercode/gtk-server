// backend/controllers/payment.js
const { sendReceiptSMS } = require("./sms");

exports.handlePayment = async (req, res) => {
  const { phone, amount, name } = req.body;
  console.log("💸 Payment received:", { phone, amount, name });

  try {
    const smsResult = await sendReceiptSMS(phone, amount, name, "GNG Mediatek");
    res.status(200).json({
      message: "Payment processed and SMS sent",
      sms: smsResult,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ message: "Failed to send SMS" });
  }
};
