//routes.js
const express = require("express");
const router = express.Router();

router.use("/equity", require("./equityRoutes"));
router.use("/", require("./paymentRoutes"));
// Add other routes as needed
module.exports = router;
// This file defines the main routing structure for the application, including equity and payment routes.
