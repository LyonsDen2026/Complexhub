import express from "express";
import { db } from "../db.js";
import { DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  const member = db.prepare("SELECT points FROM members WHERE id = ?").get(DEMO_MEMBER_ID);
  const log = db
    .prepare("SELECT * FROM rewards_log WHERE member_id = ? ORDER BY date DESC")
    .all(DEMO_MEMBER_ID);
  res.json({ points: member.points, log });
});

export default router;
