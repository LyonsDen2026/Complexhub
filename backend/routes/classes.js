import express from "express";
import { db } from "../db.js";
import { addPoints, DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM classes ORDER BY day, time").all());
});

const bookingsRouter = express.Router();

bookingsRouter.get("/", (req, res) => {
  const bookings = db
    .prepare(
      `SELECT bookings.id, bookings.status, bookings.created_at, classes.* 
       FROM bookings JOIN classes ON classes.id = bookings.class_id
       WHERE bookings.member_id = ? AND bookings.status = 'confirmed'
       ORDER BY classes.day, classes.time`
    )
    .all(DEMO_MEMBER_ID);
  res.json(bookings);
});

bookingsRouter.post("/", (req, res) => {
  const { classId } = req.body;
  const cls = db.prepare("SELECT * FROM classes WHERE id = ?").get(classId);
  if (!cls) return res.status(404).json({ error: "Class not found" });
  if (cls.spots_left <= 0) return res.status(400).json({ error: "No spots left" });

  db.prepare("INSERT INTO bookings (member_id, class_id) VALUES (?,?)").run(DEMO_MEMBER_ID, classId);
  db.prepare("UPDATE classes SET spots_left = spots_left - 1 WHERE id = ?").run(classId);
  addPoints(DEMO_MEMBER_ID, 25, `Booked ${cls.title}`);
  res.json({ ok: true });
});

bookingsRouter.delete("/:id", (req, res) => {
  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(req.params.id);
  db.prepare("UPDATE classes SET spots_left = spots_left + 1 WHERE id = ?").run(booking.class_id);
  res.json({ ok: true });
});

router.bookingsRouter = bookingsRouter;
export default router;
