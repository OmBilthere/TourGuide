import { db } from "../configs/db.js";
import jwt from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
	try {
		const authHeader = req.header("authorization") || "";
		const isBearer = authHeader.toLowerCase().startsWith("bearer ");
		if (!isBearer) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: missing bearer token",
			});
		}

		const token = authHeader.slice(7).trim();
		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: invalid bearer token",
			});
		}

		if (!process.env.JWT_SECRET) {
			return res.status(500).json({
				success: false,
				message: "Server auth is not configured",
			});
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const userId = payload?.user_id;
		if (!userId || typeof userId !== "string") {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: token payload is invalid",
			});
		}

		const result = await db.query(
			`
			SELECT clerk_user_id, full_name, email, role
			FROM users
			WHERE clerk_user_id = $1
			LIMIT 1;
			`,
			[userId]
		);

		if (result.rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: user not verified",
			});
		}

		const authUser = result.rows[0];

		req.authUser = authUser;
		req.authTokenPayload = payload;
		next();

	    } catch (error) {
		console.error("auth middleware error:", error);
		if (error?.name === "TokenExpiredError" || error?.name === "JsonWebTokenError") {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: token invalid or expired",
			});
		}
		return res.status(500).json({
			success: false,
			message: "Authentication failed",
		});
	}
};
