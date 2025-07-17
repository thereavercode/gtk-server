//paymentRoutes.js
const express = require("express");
const router = express.Router();
const { handlePayment } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/basicAuthMiddleware"); // optional

router.post("/payments", authMiddleware, handlePayment); // works even without auth
module.exports = router;
// This file defines the payment routes, specifically for storing payment information.
