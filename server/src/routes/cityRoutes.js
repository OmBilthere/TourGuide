import express from "express";
import { getAllCities, getCityByName } from "../controllers/cityController.js";

const router = express.Router();

// shows on cities page, also used for search results   
router.get("/", getAllCities);
// get single city by name
router.get("/:name", getCityByName);

export default router;