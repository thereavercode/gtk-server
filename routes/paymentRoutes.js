// paymentRoutes.js
import express from "express";
import { handlePayment } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/basicAuthMiddleware.js"; // if exported as default

const router = express.Router();

router.post("/payments", authMiddleware, handlePayment);

export default router;
