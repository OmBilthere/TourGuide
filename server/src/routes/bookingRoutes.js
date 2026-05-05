import express from "express";
import {
  createBooking,
  getBookingHistory,
  cancelBooking,
  createBookingPaymentOrder,
  verifyBookingPayment,
} from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

// create booking from user side
router.post("/create", createBooking);

//get booking history for a user
router.get("/history/:userId", getBookingHistory);

//create payment order for a booking
router.post("/pay/order", createBookingPaymentOrder);

//verify payment and mark booking as paid
router.post("/pay/verify", verifyBookingPayment);

//cancel a booking from user side
router.patch("/cancel/:bookingId", cancelBooking);

export default router;