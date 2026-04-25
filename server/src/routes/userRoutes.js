import express from "express";
import { syncUser } from "../controllers/userController.js";

const router = express.Router();

// Clerk user sync route
router.post("/sync", syncUser);

export default router;