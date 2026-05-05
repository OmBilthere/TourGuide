import { db } from "../configs/db.js";
import { getAllCitiesQuery, getCityByNameQuery } from "../queries/cityQueries.js";

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

export const getCityByName = async (req, res) => {
  try {
    const { name } = req.params;

    const result = await db.query(getCityByNameQuery, [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.status(200).json({ success: true, city: result.rows[0] });
  } catch (error) {
    console.error('get city by name error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch city' });
  }
};