import express from "express";
import { db } from "../db.js";
import { DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  const member = db.prepare("SELECT * FROM members WHERE id = ?").get(DEMO_MEMBER_ID);
  res.json({ ...member, wearables: JSON.parse(member.wearables || "[]") });
});

router.post("/wearables/connect", (req, res) => {
  const { provider } = req.body;
  const member = db.prepare("SELECT * FROM members WHERE id = ?").get(DEMO_MEMBER_ID);
  const wearables = JSON.parse(member.wearables || "[]");
  if (!wearables.includes(provider)) wearables.push(provider);
  db.prepare("UPDATE members SET wearables = ? WHERE id = ?").run(
    JSON.stringify(wearables),
    DEMO_MEMBER_ID
  );
  res.json({ wearables });
});

router.post("/wearables/disconnect", (req, res) => {
  const { provider } = req.body;
  const member = db.prepare("SELECT * FROM members WHERE id = ?").get(DEMO_MEMBER_ID);
  const wearables = JSON.parse(member.wearables || "[]").filter((w) => w !== provider);
  db.prepare("UPDATE members SET wearables = ? WHERE id = ?").run(
    JSON.stringify(wearables),
    DEMO_MEMBER_ID
  );
  res.json({ wearables });
});

export default router;
