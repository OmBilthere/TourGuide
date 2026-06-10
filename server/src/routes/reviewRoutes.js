import express from "express";
import { createReview, getReviewsByGuide } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

//create a review for a guide
router.post("/create", requireAuth, createReview);

//get all reviews for a guide
router.get("/guide/:guideId", getReviewsByGuide);

export default router;