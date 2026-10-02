import express from "express";
import { db } from "../db.js";
import { addPoints, DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  const tiers = db.prepare("SELECT * FROM membership_tiers").all();
  res.json(tiers.map((t) => ({ ...t, features: t.features.split(",") })));
});

router.post("/select", (req, res) => {
  const { tierId } = req.body;
  const tier = db.prepare("SELECT * FROM membership_tiers WHERE id = ?").get(tierId);
  if (!tier) return res.status(404).json({ error: "Tier not found" });
  db.prepare("UPDATE members SET membership_tier = ? WHERE id = ?").run(tierId, DEMO_MEMBER_ID);
  addPoints(DEMO_MEMBER_ID, 100, `Selected ${tier.name} membership`);
  res.json({ ok: true, tierId });
});

export default router;
