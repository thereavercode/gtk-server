import { supabaseAdmin } from "../supabase/client.js";
import { sendReceiptSMS } from "../controllers/sms.js"; // use import and add .js

const db = supabaseAdmin;

export async function storePayments({
  billNumber,
  amountPaid,
  bankReference,
  paidAt,
}) {
  if (!billNumber || !amountPaid || !bankReference || !paidAt) {
    throw { status: 400, message: "Missing required fields" };
  }

  const { data: billers, error: billerError } = await db
    .from("billers")
    .select("*")
    .eq("bill_number", billNumber)
    .limit(1);

  if (billerError) throw billerError;

  if (!billers || billers.length === 0) {
    throw { status: 422, message: "Invalid billNumber" };
  }

  const customer = billers[0];
  const balance = parseFloat(customer.amount) - parseFloat(amountPaid);

  const { error: insertError } = await db.from("payments").insert([
    {
      bill_number: billNumber,
      amount_paid: amountPaid,
      bank_reference: bankReference,
      paid_at: paidAt,
      balance_after: balance,
    },
  ]);

  if (insertError) throw insertError;

  if (balance <= 0) {
    const { error: updateError } = await db
      .from("billers")
      .update({ status: "paid" })
      .eq("bill_number", billNumber);

    if (updateError) throw updateError;
  }

  if (customer.phone) {
    const name = customer.customer_name || "Customer";
    const company = "GTKPAY"; // Your branding
    const message = `Payment of KES ${amountPaid} received. Remaining balance: KES ${balance}`;

    await sendReceiptSMS(customer.phone, message, name, company);
  }

  return { billNumber, amountPaid, balance };
}
// This function stores payment details in the database and sends a receipt SMS to the customer.
// It checks if the bill number is valid, updates the biller's status if fully paid,
