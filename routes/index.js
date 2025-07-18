// routes.js
import express from "express";
import equityRoutes from "./equityRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

router.use("/equity", equityRoutes);
router.use("/", paymentRoutes); // or specify "/payments" if you want to prefix

export default router;
// This file sets up the main router for the application, combining equity and payment routes.
// It uses express.Router to create a modular routing system for better organization.
