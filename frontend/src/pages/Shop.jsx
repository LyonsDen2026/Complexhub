import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Card from "../components/Card.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    product: products.find((p) => p.id === Number(id)),
    qty,
  }));
  const total = cartItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0);

  const checkout = async () => {
    const items = Object.entries(cart).map(([productId, qty]) => ({ productId: Number(productId), qty }));
    const res = await api.checkout(items);
    setMessage(`Order placed — AED ${res.total}. Points earned: +${Math.round(res.total / 10)}`);
    setCart({});
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <SectionHeading
          eyebrow="Member Store"
          title="Shop The Collection"
          subtitle="House label plus curated partner brands — Nike, On Running, Lululemon, Ounass."
        />
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <div className="text-den-muted text-xs uppercase tracking-wide">{p.brand}</div>
              <div className="font-display uppercase mt-1">{p.name}</div>
              <div className="text-den-muted text-sm mt-1 mb-3">{p.description}</div>
              <div className="flex justify-between items-center">
                <span className="font-display">AED {p.price}</span>
                <button
                  onClick={() => addToCart(p.id)}
                  className="px-3 py-1.5 rounded-md bg-den-orange text-black text-xs uppercase font-semibold tracking-wide hover:bg-den-orange/80"
                >
                  Add
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg uppercase tracking-wide mb-4">Your Cart</h2>
        <Card className="space-y-3">
          {cartItems.length === 0 && <div className="text-den-muted text-sm">Cart is empty.</div>}
          {cartItems.map(
            ({ product, qty }) =>
              product && (
                <div key={product.id} className="flex justify-between items-center text-sm">
                  <div>
                    {product.name} × {qty}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>AED {product.price * qty}</span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-den-muted hover:text-den-orange"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
          )}
          {cartItems.length > 0 && (
            <>
              <div className="border-t border-white/10 pt-3 flex justify-between font-display">
                <span>Total</span>
                <span>AED {total}</span>
              </div>
              <button
                onClick={checkout}
                className="w-full py-2 rounded-md bg-den-orange text-black uppercase text-sm font-semibold tracking-wide hover:bg-den-orange/80"
              >
                Checkout
              </button>
            </>
          )}
        </Card>
        {message && (
          <div className="mt-4 text-den-green bg-den-green/10 border border-den-green/30 rounded-md p-3 text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
