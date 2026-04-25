import express from "express";
import {
  getGuidesByCity,
  getGuideById,
  getGuideBookings,
  confirmGuideBooking,
  completeGuideBooking,
} from "../controllers/guideController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getGuidesByCity);
router.get("/:id", getGuideById);
router.get("/bookings/:guideId", requireAuth, getGuideBookings);
router.patch("/bookings/complete/:bookingId", requireAuth, completeGuideBooking);
router.patch("/bookings/confirm/:bookingId", requireAuth, confirmGuideBooking);

export default router;