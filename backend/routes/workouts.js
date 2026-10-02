import express from "express";
import { db } from "../db.js";
import { addPoints, DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(
    db.prepare("SELECT * FROM workouts WHERE member_id = ? ORDER BY date DESC").all(DEMO_MEMBER_ID)
  );
});

router.post("/", (req, res) => {
  const { title, type, duration, calories, source } = req.body;
  db.prepare(
    "INSERT INTO workouts (member_id, title, type, duration, calories, source) VALUES (?,?,?,?,?,?)"
  ).run(DEMO_MEMBER_ID, title, type, duration || 0, calories || 0, source || "manual");
  addPoints(DEMO_MEMBER_ID, 15, `Logged workout: ${title}`);
  res.json({ ok: true });
});

export default router;
