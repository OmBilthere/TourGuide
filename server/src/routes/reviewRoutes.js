import express from "express";
import { createReview, getReviewsByGuide } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", requireAuth, createReview);
router.get("/guide/:guideId", getReviewsByGuide);

export default router;