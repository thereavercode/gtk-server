//validationController.js
const db = require("../src/db");

exports.validateCustomer = async (req, res) => {
  const { billNumber, amount } = req.body;

  if (!billNumber) {
    return res
      .status(400)
      .json({ responseCode: "400", responseMessage: "billNumber is required" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM billers WHERE bill_number = $1",
      [billNumber]
    );

    if (result.rows.length === 0) {
      return res.status(422).json({
        responseCode: "422",
        responseMessage: "Invalid bill reference",
      });
    }

    const customer = result.rows[0];

    res.status(200).json({
      customerName: customer.customer_name,
      billNumber: customer.bill_number,
      amount: customer.amount.toString(),
      description: "Success",
    });
  } catch (err) {
    console.error("Validation Error:", err);
    res
      .status(500)
      .json({ responseCode: "500", responseMessage: "Server error" });
  }
};
