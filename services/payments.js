import { supabaseAdmin } from "../supabase/client.js";
import { sendReceiptSMS } from "../controllers/sms.js";

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

  // 1. Fetch bill details
  const { data: billers, error: billerError } = await db
    .from("billers")
    .select("*")
    .eq("bill_number", billNumber)
    .limit(1);

  if (billerError) throw billerError;
  if (!billers || billers.length === 0) {
    throw { status: 422, message: "Invalid billNumber" };
  }

  const biller = billers[0];
  const totalDue = parseFloat(biller.amount);

  // 2. Fetch total previous payments for the bill number
  const { data: previousPayments, error: paymentsError } = await db
    .from("payments")
    .select("amount_paid")
    .eq("bill_number", billNumber);

  if (paymentsError) throw paymentsError;

  const totalPreviouslyPaid = previousPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount_paid),
    0
  );

  const totalPaid = totalPreviouslyPaid + parseFloat(amountPaid);
  const balanceAfter = totalDue - totalPaid;

  // 3. Insert the new payment record
  const { error: insertError } = await db.from("payments").insert([
    {
      bill_number: billNumber,
      amount_paid: amountPaid,
      bank_reference: bankReference,
      paid_at: paidAt,
      balance_after: balanceAfter,
    },
  ]);

  if (insertError) throw insertError;

  // 4. Update biller status if fully paid
  if (balanceAfter <= 0) {
    const { error: updateError } = await db
      .from("billers")
      .update({ status: "paid" })
      .eq("bill_number", billNumber);

    if (updateError) throw updateError;
  }

  // 5. Send SMS receipt
  if (biller.phone) {
    const name = biller.customer_name || "Customer";
    const company = "GTKPAY";
    const formattedBalance =
      balanceAfter <= 0 ? "0.00" : balanceAfter.toFixed(2);
    const message = `Payment of KES ${amountPaid} received. Remaining balance: KES ${formattedBalance}`;

    await sendReceiptSMS(biller.phone, message, name, company);
  }

  return { billNumber, amountPaid, balance: balanceAfter };
}
