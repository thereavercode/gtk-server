exports.validateCustomer = (req, res) => {
  const { billNumber, amount } = req.body;

  // Validate required billNumber field
  if (!billNumber) {
    return res.status(400).json({
      description: "Missing required field: billNumber",
    });
  }

  // Simulate database/ERP lookup for billNumber
  const mockDatabase = {
    123456: { customerName: "Jane Josh", amount: "10" },
    654321: { customerName: "Paul Njoroge", amount: "0" },
  };

  const record = mockDatabase[billNumber];

  if (record) {
    return res.status(200).json({
      customerName: record.customerName,
      billNumber,
      amount: record.amount || "0", // Default to 0 if not available
      description: "Success",
    });
  } else {
    return res.status(404).json({
      description: "Validation failed",
    });
  }
};
// This controller validates customer information based on a bill number.
// It checks if the bill number exists in a mock database and returns customer details if found.
