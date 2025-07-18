import express from "express";

import { validateCustomer } from "../controllers/validationController.js";
import { handleWebhook } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/basicAuthMiddleware.js";

const router = express.Router();

// POST /api/equity/validate - protected by Basic Auth
router.post("/validate", authMiddleware, validateCustomer);

// POST /api/equity/webhook - protected by Basic Auth
router.post("/webhook", authMiddleware, handleWebhook);

export default router;
// This file defines the equity routes, specifically for customer validation and webhook handling.
// It uses basic authentication middleware to protect the endpoints.
