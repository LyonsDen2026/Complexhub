import { db } from "./db.js";

export function addPoints(memberId, points, reason) {
  db.prepare("UPDATE members SET points = points + ? WHERE id = ?").run(points, memberId);
  db.prepare("INSERT INTO rewards_log (member_id, points, reason) VALUES (?,?,?)").run(
    memberId,
    points,
    reason
  );
}

export const DEMO_MEMBER_ID = 1;
