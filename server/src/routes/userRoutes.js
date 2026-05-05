import express from "express";
import { syncUser } from "../controllers/userController.js";

const router = express.Router();

// storing the user info in our database when they log in for the first time, and updating it on subsequent logins
router.post("/sync", syncUser);

export default router;