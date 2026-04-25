import express from "express";
import { createReview } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", requireAuth, createReview);

export default router;