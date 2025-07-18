import { supabaseAdmin } from "../supabase/client.js";
const db = supabaseAdmin;

export const validateCustomer = async (req, res) => {
  const { billNumber, amount } = req.body;

  if (!billNumber) {
    return res.status(400).json({
      responseCode: "400",
      responseMessage: "billNumber is required",
    });
  }

  try {
    const { data: customer, error } = await db
      .from("billers")
      .select("*")
      .eq("bill_number", billNumber)
      .single(); // returns only one row, or null

    if (error) {
      console.error(`Supabase error for billNumber ${billNumber}:`, error);
      return res.status(500).json({
        responseCode: "500",
        responseMessage: "Server error during validation",
      });
    }

    if (!customer) {
      return res.status(404).json({
        responseCode: "404",
        responseMessage: "Invalid bill reference",
      });
    }

    // Optional: Validate if amount is provided and mismatches
    if (amount && parseFloat(amount) !== parseFloat(customer.amount)) {
      return res.status(400).json({
        responseCode: "400",
        responseMessage: "Incorrect amount",
      });
    }

    return res.status(200).json({
      customerName: customer.customer_name,
      billNumber: customer.bill_number,
      amount: customer.amount.toString(),
      description: "Success",
    });
  } catch (err) {
    console.error(
      `Unexpected error during bill validation for ${billNumber}:`,
      err
    );
    return res.status(500).json({
      responseCode: "500",
      responseMessage: "Internal server error",
    });
  }
};
// This controller validates customer bills by checking the bill number against the database.
// It returns customer details if found, or appropriate error messages for missing or invalid data.
