import express from "express";
import { getAllCities } from "../controllers/cityController.js";

const router = express.Router();

router.get("/", getAllCities);

export default router;