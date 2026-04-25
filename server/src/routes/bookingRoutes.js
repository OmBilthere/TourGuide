import express from "express";
import {
  createBooking,
  getBookingHistory,
  cancelBooking,
  payBooking,
  createBookingPaymentOrder,
  verifyBookingPayment,
} from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);
 
router.post("/create", createBooking);
router.get("/history/:userId", getBookingHistory);
router.post("/pay/order", createBookingPaymentOrder);
router.post("/pay/verify", verifyBookingPayment);
router.patch("/pay/:bookingId", payBooking);
router.patch("/cancel/:bookingId", cancelBooking);

export default router;