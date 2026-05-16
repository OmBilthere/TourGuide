import {
  getGuidesByCityQuery,
  getGuideByIdQuery,
  getGuideBookingsQuery,
  getGuideBookingForActionQuery,
  getGuideBookingForCompletionQuery,
  getGuideIdByUserIdQuery,
  getGuideProfileByUserIdQuery,
  getCityIdByNameQuery,
  upsertGuideByUserIdQuery,
  deleteGuideLanguagesByGuideIdQuery,
  insertGuideLanguageQuery,
  deleteGuideHighlightsByGuideIdQuery,
  insertGuideHighlightQuery,
  deleteGuideSlotsByGuideIdQuery,
  insertGuideSlotQuery,
  updateGuideSlotsAvailabilityByGuideIdQuery,
  confirmGuideBookingQuery,
  rejectGuideBookingQuery,
  completeGuideBookingQuery,
} from "../queries/guideQueries.js";

import { db } from "../configs/db.js";
import { updateUserPhoneQuery } from "../queries/userQueries.js";
import { restoreSlotAvailabilityQuery } from "../queries/bookingQueries.js";
import crypto from "crypto";

const sanitizeStringArray = (values = []) => {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.map((item) => String(item || "").trim()).filter(Boolean))];
};

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

    const bookingCheck = await db.query(getGuideBookingForActionQuery, [bookingId, guide.id]);
    const booking = bookingCheck.rows[0];

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    if (booking.booking_status !== "requested") {
      return res.status(400).json({
        success: false,
        message: "Only requested bookings can be confirmed",
      });
    }

    const completionCode = String(crypto.randomInt(100000, 1000000));

    const result = await db.query(confirmGuideBookingQuery, [bookingId, guide.id, completionCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    res.status(200).json({
      success: true,
      booking: result.rows[0],
      completion_code: completionCode,
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
    const { completion_code } = req.body;
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

    const codeValue = String(completion_code || "").trim();
    if (!codeValue) {
      return res.status(400).json({
        success: false,
        message: "Completion code is required",
      });
    }

    const bookingResult = await db.query(getGuideBookingForCompletionQuery, [bookingId, guide.id]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    if (booking.booking_status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Booking must be confirmed before completion",
      });
    }

    if (String(booking.completion_code || "") !== codeValue) {
      return res.status(400).json({
        success: false,
        message: "Invalid completion code",
      });
    }

    const result = await db.query(completeGuideBookingQuery, [bookingId, guide.id, codeValue]);

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

export const getMyGuideProfile = async (req, res) => {
  try {
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const result = await db.query(getGuideProfileByUserIdQuery, [authUserId]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        profile: null,
      });
    }

    return res.status(200).json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    console.error("get my guide profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch guide profile",
    });
  }
};

export const upsertMyGuideProfile = async (req, res) => {
  const client = await db.connect();

  try {
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const {
      city,
      speciality,
      price,
      experience_years,
      about,
      phone,
      languages = [],
      highlights = [],
      slots = [],
    } = req.body;

    const cityName = String(city || "").trim();
    const specialityValue = String(speciality || "").trim();
    const aboutValue = String(about || "").trim();
    const experienceYears = Number(experience_years);
    const priceValue = Number(price);

    if (!cityName || !specialityValue || Number.isNaN(experienceYears) || Number.isNaN(priceValue)) {
      return res.status(400).json({
        success: false,
        message: "City, speciality, experience_years and price are required",
      });
    }

    const cleanLanguages = sanitizeStringArray(languages);
    const cleanHighlights = sanitizeStringArray(highlights);
    const cleanSlots = sanitizeStringArray(slots);

    await client.query("BEGIN");

    const cityResult = await client.query(getCityIdByNameQuery, [cityName]);
    if (cityResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Selected city not found",
      });
    }

    const cityId = cityResult.rows[0].id;

    const guideResult = await client.query(upsertGuideByUserIdQuery, [
      authUserId,
      cityId,
      specialityValue,
      priceValue,
      experienceYears,
      aboutValue,
    ]);

    const guideId = guideResult.rows[0]?.id;

    if (!guideId) {
      await client.query("ROLLBACK");
      return res.status(500).json({
        success: false,
        message: "Failed to save guide profile",
      });
    }

    // update user's phone if provided
    if (phone && String(phone).trim() !== "") {
      await client.query(updateUserPhoneQuery, [authUserId, String(phone).trim()]);
    }

    await client.query(deleteGuideLanguagesByGuideIdQuery, [guideId]);
    for (const language of cleanLanguages) {
      await client.query(insertGuideLanguageQuery, [guideId, language]);
    }

    await client.query(deleteGuideHighlightsByGuideIdQuery, [guideId]);
    for (const highlight of cleanHighlights) {
      await client.query(insertGuideHighlightQuery, [guideId, highlight]);
    }

    await client.query(deleteGuideSlotsByGuideIdQuery, [guideId]);
    for (const slot of cleanSlots) {
      await client.query(insertGuideSlotQuery, [guideId, slot]);
    }

    await client.query("COMMIT");

    const profileResult = await db.query(getGuideProfileByUserIdQuery, [authUserId]);

    return res.status(200).json({
      success: true,
      profile: profileResult.rows[0] || null,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("upsert my guide profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save guide profile",
    });
  } finally {
    client.release();
  }
};

export const updateMyGuideAvailability = async (req, res) => {
  try {
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const { is_available } = req.body;
    if (typeof is_available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_available must be a boolean",
      });
    }

    const guideResult = await db.query(getGuideIdByUserIdQuery, [authUserId]);
    const guide = guideResult.rows[0];

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    await db.query(updateGuideSlotsAvailabilityByGuideIdQuery, [guide.id, is_available]);

    const profileResult = await db.query(getGuideProfileByUserIdQuery, [authUserId]);

    return res.status(200).json({
      success: true,
      profile: profileResult.rows[0] || null,
      message: is_available
        ? "You are now marked available"
        : "You are now marked unavailable",
    });
  } catch (error) {
    console.error("update guide availability error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};

export const rejectGuideBooking = async (req, res) => {
  const client = await db.connect();

  try {
    const { bookingId } = req.params;
    const authUserId = req.authUser?.clerk_user_id;

    if (req.authUser?.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide access only",
      });
    }

    const guideResult = await client.query(getGuideIdByUserIdQuery, [authUserId]);
    const guide = guideResult.rows[0];

    if (!guide) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: guide profile not found",
      });
    }

    await client.query("BEGIN");

    const bookingResult = await client.query(getGuideBookingForActionQuery, [bookingId, guide.id]);
    const booking = bookingResult.rows[0];

    if (!booking) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    if (booking.booking_status !== "requested") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Only requested bookings can be rejected",
      });
    }

    const rejectResult = await client.query(rejectGuideBookingQuery, [bookingId, guide.id]);

    if (rejectResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Booking not found for this guide",
      });
    }

    if (booking.slot_id) {
      await client.query(restoreSlotAvailabilityQuery, [booking.slot_id]);
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      booking: rejectResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("reject booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject booking",
    });
  } finally {
    client.release();
  }
};