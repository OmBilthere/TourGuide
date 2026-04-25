import { db } from "../configs/db.js";
import { getAllCitiesQuery } from "../queries/cityQueries.js";

export const getAllCities = async (req, res) => {
  try {
    const result = await db.query(getAllCitiesQuery);

    res.status(200).json({
      success: true,
      cities: result.rows,
    });
  } catch (error) {
    console.error("get cities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};