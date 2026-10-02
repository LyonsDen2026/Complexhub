import express from "express";
import cors from "cors";
import { db } from "./db.js";
import memberRoutes from "./routes/member.js";
import membershipRoutes from "./routes/memberships.js";
import classRoutes from "./routes/classes.js";
import productRoutes from "./routes/products.js";
import workoutRoutes from "./routes/workouts.js";
import rewardRoutes from "./routes/rewards.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/member", memberRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/bookings", classRoutes.bookingsRouter);
app.use("/api/products", productRoutes);
app.use("/api/orders", productRoutes.ordersRouter);
app.use("/api/workouts", workoutRoutes);
app.use("/api/rewards", rewardRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lyon's Den API listening on :${PORT}`);
});
