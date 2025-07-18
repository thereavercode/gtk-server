import dotenv from "dotenv";
dotenv.config();

import africastalking from "africastalking";

const africastalkingClient = africastalking({
  apiKey: process.env.AFRICASTALKING_APIKEY,
  username: process.env.AFRICASTALKING_USERNAME || "sandbox",
});

const sms = africastalkingClient.SMS;

const formatPhone = (phone) => {
  if (phone.startsWith("+")) return phone;
  if (phone.startsWith("0")) return `+254${phone.slice(1)}`;
  if (phone.startsWith("254")) return `+${phone}`;
  return phone;
};

export const sendReceiptSMS = async (phone, amountMessage, name, company) => {
  const message = `Hello ${name}, we've received your ${amountMessage}. Thank you for choosing ${company}.`;

  try {
    const result = await sms.send({
      to: [formatPhone(phone)],
      from: "GTKPAY",
      message,
    });

    console.log("✅ SMS sent:", result);
    return result;
  } catch (err) {
    console.error("❌ SMS sending failed:", err.response?.data || err.message);
    return null;
  }
};
// This module handles sending SMS notifications using Africa's Talking API.
// It formats phone numbers and constructs a message based on the payment details.
