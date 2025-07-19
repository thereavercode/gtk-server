import dotenv from "dotenv";
dotenv.config();

import africastalking from "africastalking";
import { supabaseAdmin } from "../supabase/client.js";

const db = supabaseAdmin;

// Configure Africa's Talking client
const africastalkingClient = africastalking({
  apiKey: process.env.AFRICASTALKING_APIKEY,
  username: process.env.AFRICASTALKING_USERNAME || "sandbox",
});

const sms = africastalkingClient.SMS;

/**
 * Formats a phone number to international format (+254...).
 * @param {string} phone
 * @returns {string}
 */
const formatPhone = (phone) => {
  if (!phone || typeof phone !== "string") return phone;
  if (phone.startsWith("+")) return phone;
  if (phone.startsWith("0")) return `+254${phone.slice(1)}`;
  if (phone.startsWith("254")) return `+${phone}`;
  return phone;
};

/**
 * Fetch customer_name and user_id from the billers table using bill_number.
 * @param {string|null} billNumber
 * @returns {Promise<{customerName: string|null, userId: string|null}>}
 */
async function getBillerInfo(billNumber) {
  if (!billNumber) return { customerName: null, userId: null };

  try {
    const { data, error } = await db
      .from("billers")
      .select("customer_name, user_id")
      .eq("bill_number", billNumber)
      .limit(1)
      .single();

    if (error) throw error;

    return {
      customerName: data?.customer_name || null,
      userId: data?.user_id || null,
    };
  } catch (error) {
    console.error("❌ Error fetching biller info:", error.message || error);
    return { customerName: null, userId: null };
  }
}

/**
 * Log SMS details into the sms_logs table.
 * @param {Object} payload
 * @returns {Promise<null|object>}
 */
async function logSmsToDb({
  phone,
  name,
  message,
  status = "sent",
  provider_id = null,
  user_id = null,
  bill_number,
}) {
  try {
    const { error } = await db.from("sms_logs").insert([
      {
        phone,
        name,
        message,
        status,
        provider_id,
        user_id,
        bill_number,
      },
    ]);

    if (error) throw error;

    console.log("📦 SMS logged successfully");
    return null;
  } catch (error) {
    console.error("❌ Failed to log SMS:", error.message || error);
    return error;
  }
}

/**
 * Send SMS via Africa's Talking and log to Supabase.
 * @param {string} phone - Raw phone number
 * @param {string} amountMessage - Amount message content
 * @param {string} fallbackName - Default fallback name
 * @param {string} company - Sender ID
 * @param {string|null} billNumber - Optional bill number
 * @returns {Promise<null|object>}
 */
export async function sendReceiptSMS(
  phone,
  amountMessage,
  fallbackName = "Customer",
  company = "GTKPAY",
  billNumber = null
) {
  const formattedPhone = formatPhone(phone);
  const { customerName, userId } = await getBillerInfo(billNumber);
  const nameToUse = customerName || fallbackName;

  const message = `Hello ${nameToUse}, we've received your ${amountMessage}. Thank you for choosing ${company}.`;

  try {
    const result = await sms.send({
      to: [formattedPhone],
      from: company,
      message,
    });

    const providerId = result?.SMSMessageData?.Messages?.[0]?.messageId || null;

    await logSmsToDb({
      phone: formattedPhone,
      name: nameToUse,
      message,
      status: "sent",
      provider_id: providerId,
      user_id: userId,
      bill_number: billNumber,
    });

    console.log("✅ SMS sent successfully:", result);
    return result;
  } catch (err) {
    await logSmsToDb({
      phone: formattedPhone,
      name: nameToUse,
      message,
      status: "failed",
      user_id: userId,
      bill_number: billNumber,
    });

    console.error("❌ SMS failed:", err.response?.data || err.message || err);
    return null;
  }
}
