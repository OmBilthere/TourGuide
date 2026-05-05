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

// get guides by city 
router.get("/", getGuidesByCity);

// guide bookings management routes used to show guide all bookings
router.get("/bookings/:guideId", requireAuth, getGuideBookings);

//guide can confirm the booking by booking id
router.patch("/bookings/confirm/:bookingId", requireAuth, confirmGuideBooking);

//guide can complete the booking by booking id
router.patch("/bookings/complete/:bookingId", requireAuth, completeGuideBooking);

// get guide details by guide id
router.get("/:id", getGuideById);

export default router;