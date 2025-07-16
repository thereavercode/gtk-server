// backend/controllers/sms.js

exports.handleInboundSMS = (req, res) => {
  const { from, text, to, id, date } = req.body;
  if (!from || !text || !to || !id || !date) {
    console.warn("Incomplete SMS callback:", req.body);
    return res.sendStatus(400);
  }

  console.log(
    `📥 Incoming SMS from ${from} to ${to}: "${text}" @ ${date} (ID: ${id})`
  );
  // TODO: Add business logic here (e.g., log to DB, auto-reply)
  res.sendStatus(200);
};
// Example: Auto-reply logic
// if (text.toLowerCase().includes("hello")) {
//   const reply = `Hello ${from}, how can I assist you today?`;
//   // Send reply SMS (implement SMS sending logic)
// }
