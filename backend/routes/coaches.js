import express from "express";
import { db } from "../db.js";
import { addPoints, DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  const coaches = db.prepare("SELECT * FROM coaches ORDER BY id").all();
  const classes = db.prepare("SELECT * FROM classes ORDER BY day, time").all();

  const result = coaches.map((coach) => ({
    ...coach,
    initials: coach.name
      .replace(/^Coach\s+/i, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    timetable: classes.filter((c) => c.coach === coach.name),
  }));
  res.json(result);
});

router.get("/:id", (req, res) => {
  const coach = db.prepare("SELECT * FROM coaches WHERE id = ?").get(req.params.id);
  if (!coach) return res.status(404).json({ error: "Coach not found" });
  const classes = db
    .prepare("SELECT * FROM classes WHERE coach = ? ORDER BY day, time")
    .all(coach.name);
  res.json({ ...coach, timetable: classes });
});

export default router;
