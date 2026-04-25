import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectCloudinary from "./src/configs/cloudinary.js";

import userRoutes from "./src/routes/userRoutes.js"
import bookingRoutes from "./src/routes/bookingRoutes.js";
import guideRoutes from "./src/routes/guideRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import cityRoutes from "./src/routes/cityRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


connectCloudinary();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TourGuide backend running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/reviews", reviewRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});