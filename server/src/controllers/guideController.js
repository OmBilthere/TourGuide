import {
  getGuidesByCityQuery,
  getGuideByIdQuery,
  getGuideBookingsQuery,
  getGuideIdByUserIdQuery,
  confirmGuideBookingQuery,
  completeGuideBookingQuery,
} from "../queries/guideQueries.js";

import { db } from "../configs/db.js";

export const getGuidesByCity = async (req, res) => {
  try {
    const { city } = req.query;

    const result = await db.query(getGuidesByCityQuery, [city]);

    res.status(200).json({
      success: true,
      guides: result.rows,
    });
  } catch (error) {
    console.error("get guides error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guides",
    });
  }
};

export const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(getGuideByIdQuery, [id]);

    res.status(200).json({
      success: true,
      guide: result.rows[0],
    });
  } catch (error) {
    console.error("get guide detail error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide details",
    });
  }
};

export const getGuideBookings = async (req, res) => {
  try {
    const { guideId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const guideResult = await db.query(getGuideIdByUserIdQuery, [authUserId]);
    const guide = guideResult.rows[0];

    if (!guide || String(guide.id) !== String(guideId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: cannot access another guide's bookings",
      });
    }

    const result = await db.query(getGuideBookingsQuery, [guideId]);

    res.status(200).json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("guide bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide bookings",
    });
  }
};

export const confirmGuideBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const guideResult = await db.query(getGuideIdByUserIdQuery, [authUserId]);
    const guide = guideResult.rows[0];

    if (!guide) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide profile not found",
      });
    }

    const result = await db.query(confirmGuideBookingQuery, [bookingId, guide.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    res.status(200).json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("confirm booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm booking",
    });
  }
};

export const completeGuideBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const guideResult = await db.query(getGuideIdByUserIdQuery, [authUserId]);
    const guide = guideResult.rows[0];

    if (!guide) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide profile not found",
      });
    }

    const result = await db.query(completeGuideBookingQuery, [bookingId, guide.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    res.status(200).json({
      success: true,
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("complete booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete booking",
    });
  }
};