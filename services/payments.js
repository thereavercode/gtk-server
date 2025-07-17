// services/paymentService.js
const db = require("../src/db");
const { sendReceiptSMS } = require("../controllers/sms");

exports.storePayments = async ({
  billNumber,
  amountPaid,
  bankReference,
  paidAt,
}) => {
  if (!billNumber || !amountPaid || !bankReference || !paidAt) {
    throw { status: 400, message: "Missing required fields" };
  }

  const result = await db.query(
    "SELECT * FROM billers WHERE bill_number = $1",
    [billNumber]
  );
  if (result.rows.length === 0) {
    throw { status: 422, message: "Invalid billNumber" };
  }

  const customer = result.rows[0];
  const balance = parseFloat(customer.amount) - parseFloat(amountPaid);

  await db.query(
    `INSERT INTO payments (bill_number, amount_paid, bank_reference, paid_at, balance_after)
     VALUES ($1, $2, $3, $4, $5)`,
    [billNumber, amountPaid, bankReference, paidAt, balance]
  );

  if (balance <= 0) {
    await db.query("UPDATE billers SET status = $1 WHERE bill_number = $2", [
      "paid",
      billNumber,
    ]);
  }

  if (customer.phone) {
    const name = customer.customer_name || "Customer";
    const company = "GTKPAY"; // Replace with your brand name if needed
    const message = `Payment of KES ${amountPaid} received. Remaining balance: KES ${balance}`;

    await sendReceiptSMS(customer.phone, message, name, company);
  }

  return { billNumber, amountPaid, balance };
};
