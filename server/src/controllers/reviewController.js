import { db } from "../configs/db.js";
import {
  createReviewQuery,
  updateGuideRatingQuery,
} from "../queries/reviewQueries.js";

export const createReview = async (req, res) => {
  try {
    const {
      booking_id,
      user_id,
      guide_id,
      rating,
      review_text,
    } = req.body;

    const reviewResult = await db.query(createReviewQuery, [
      booking_id,
      user_id,
      guide_id,
      rating,
      review_text,
    ]);

    await db.query(updateGuideRatingQuery, [guide_id]);

    res.status(201).json({
      success: true,
      review: reviewResult.rows[0],
    });
  } catch (error) {
    console.error("create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};