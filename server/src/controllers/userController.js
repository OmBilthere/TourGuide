import { db } from "../configs/db.js";
import { upsertUserQuery } from "../queries/userQueries.js";
import jwt from "jsonwebtoken";

export const syncUser = async (req, res) => {
  
  try {
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server auth is not configured",
      });
    }

    const { clerk_user_id, full_name, email, avatar_url, role } = req.body;

    const allowedRoles = ["tourist", "guide"];
    const finalRole = allowedRoles.includes(role) ? role : "tourist";

    const result = await db.query(upsertUserQuery, [
      clerk_user_id,
      full_name,
      email,
      avatar_url,
      finalRole,
    ]);

    const token = jwt.sign(
      {
        user_id: clerk_user_id,
        role: finalRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      user: result.rows[0],
      token,
    });
  } catch (error) {
    console.error("sync user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync user",
    });
  }
};