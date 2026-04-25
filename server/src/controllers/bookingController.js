import { db } from "../configs/db.js";
import crypto from "crypto";
import Razorpay from "razorpay";

import {
  createBookingQuery,
  updateSlotAvailabilityQuery,
  getBookingHistoryQuery,
  payBookingQuery,
  getBookingForPaymentQuery,
  getBookingOwnerQuery,
  verifyAndMarkPaidQuery,
  cancelBookingQuery,
  restoreSlotAvailabilityQuery,
  getBookingSlotQuery,
} from "../queries/bookingQueries.js";

import { upsertUserQuery } from "../queries/userQueries.js";


export const createBooking = async (req, res) => {
  try {
    const authUserId = req.authUser?.clerk_user_id;
    const {
      user_id,
      full_name,
      email,
      avatar_url,
      role,
      guide_id,
      city_id,
      slot_id,
      amount,
      trip_date,
    } = req.body;

    if (authUserId !== user_id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot create booking for another user",
      });
    }

    await db.query(upsertUserQuery, [
      user_id,
      full_name || "",
      email || "",
      avatar_url || "",
      role === "guide" ? "guide" : "tourist",
    ]);

    const bookingResult = await db.query(createBookingQuery, [
      user_id,
      guide_id,
      city_id,
      slot_id,
      amount,
      trip_date,
    ]);

    await db.query(updateSlotAvailabilityQuery, [slot_id]);

    res.status(201).json({
      success: true,
      booking: bookingResult.rows[0],
    });
  } catch (error) {
    console.error("create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

export const getBookingHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    if (authUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot access another user's history",
      });
    }

    const result = await db.query(getBookingHistoryQuery, [userId]);

    res.status(200).json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("booking history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking history",
    });
  }
};


export const createBookingPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const authUserId = req.authUser?.clerk_user_id;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys are not configured",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const bookingResult = await db.query(getBookingForPaymentQuery, [bookingId]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user_id !== authUserId) {
      return res.status(403).json({ success: false, message: "Unauthorized payment request" });
    }

    if (booking.booking_status !== "confirmed") {
      return res.status(400).json({ success: false, message: "Booking is not confirmed yet" });
    }

    if (booking.payment_status === "paid") {
      return res.status(400).json({ success: false, message: "Booking already paid" });
    }

    const amountInPaise = Math.round(Number(booking.amount) * 100);
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({ success: false, message: "Invalid booking amount for payment" });
    }

    const receipt = `bk_${String(booking.id).replace(/-/g, "").slice(0, 30)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: { bookingId: String(booking.id), userId: String(authUserId) },
    });

    return res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("create payment order error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create payment order",
    });
  }
};

export const verifyBookingPayment = async (req, res) => {
  try {
    const authUserId = req.authUser?.clerk_user_id;
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: "Razorpay secret is not configured" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed" });
    }

    const bookingResult = await db.query(getBookingForPaymentQuery, [bookingId]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user_id !== authUserId) {
      return res.status(403).json({ success: false, message: "Unauthorized payment verification" });
    }

    const result = await db.query(verifyAndMarkPaidQuery, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be applied to this booking",
      });
    }

    return res.status(200).json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error("verify payment error:", error);
    return res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};

export const payBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    const ownerResult = await db.query(getBookingOwnerQuery, [bookingId]);
    const owner = ownerResult.rows[0];

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (owner.user_id !== authUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot pay for another user's booking",
      });
    }

    const result = await db.query(payBookingQuery, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Payment is allowed only for confirmed bookings",
      });
    }

    res.status(200).json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("pay booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    const ownerResult = await db.query(getBookingOwnerQuery, [bookingId]);
    const owner = ownerResult.rows[0];

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (owner.user_id !== authUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot cancel another user's booking",
      });
    }

    const slotResult = await db.query(getBookingSlotQuery, [bookingId]);
    const slotId = slotResult.rows[0]?.slot_id;

    const result = await db.query(cancelBookingQuery, [bookingId]);

    if (slotId) {
      await db.query(restoreSlotAvailabilityQuery, [slotId]);
    }

    res.status(200).json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

