import express from "express";
import { db } from "../db.js";
import { addPoints, DEMO_MEMBER_ID } from "../utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM products ORDER BY category").all());
});

const ordersRouter = express.Router();

ordersRouter.get("/", (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders WHERE member_id = ? ORDER BY created_at DESC")
    .all(DEMO_MEMBER_ID);
  res.json(orders.map((o) => ({ ...o, items: JSON.parse(o.items) })));
});

ordersRouter.post("/", (req, res) => {
  const { items } = req.body; // [{productId, qty}]
  if (!items || !items.length) return res.status(400).json({ error: "No items" });

  const products = db.prepare("SELECT * FROM products").all();
  let total = 0;
  const lineItems = items.map(({ productId, qty }) => {
    const product = products.find((p) => p.id === productId);
    total += product.price * qty;
    return { productId, qty, name: product.name, price: product.price };
  });

  db.prepare("INSERT INTO orders (member_id, items, total) VALUES (?,?,?)").run(
    DEMO_MEMBER_ID,
    JSON.stringify(lineItems),
    total
  );
  addPoints(DEMO_MEMBER_ID, Math.round(total / 10), "Member store purchase");
  res.json({ ok: true, total });
});

router.ordersRouter = ordersRouter;
export default router;
