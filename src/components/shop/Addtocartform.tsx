"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    colours: string[];
    sizes: string[];
    stock: number;
  };
}

const EMPTY_SHIPPING = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "NG",
  postcode: "",
};

const COLOUR_HEX: Record<string, string> = {
  gold: "#C9A96E",
  silver: "#C0C0C0",
  black: "#1A1A1A",
  white: "#F5F5F0",
  multi: "conic-gradient(#C9A96E,#E91E8C,#2980B9,#27AE60,#C9A96E)",
  pink: "#E91E8C",
  blue: "#2980B9",
  green: "#27AE60",
};

export default function AddToCartForm({ product }: Props) {
  const [colour, setColour] = useState(product.colours[0] ?? "");
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState("");
  const [showShipping, setShowShipping] = useState(false);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const addItem = useCartStore((s) => s.addItem);

  function setField(key: keyof typeof EMPTY_SHIPPING, value: string) {
    setShipping((s) => ({ ...s, [key]: value }));
  }

  async function handleBuyNow() {
    if (outOfStock) return;
    if (!showShipping) { setShowShipping(true); return; }
    if (!shipping.fullName || !shipping.email || !shipping.address || !shipping.city) {
      setBuyError("Please fill in all required fields.");
      return;
    }
    setBuyLoading(true);
    setBuyError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: product.id, name: product.name, price: product.price, image: product.image, colour, size, quantity: qty }],
          shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err: any) {
      setBuyError(err.message);
      setBuyLoading(false);
    }
  }

  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      colour,
      size,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Colour selector */}
      {product.colours.length > 0 && (
        <div>
          <p className="text-[11px] tracking-widest uppercase text-(--muted) mb-3">
            Colour — <span className="text-(--fg)">{colour}</span>
          </p>
          <div className="flex gap-2.5">
            {product.colours.map((c) => (
              <button
                key={c}
                title={c}
                onClick={() => setColour(c)}
                className={`
                  w-8 h-8 rounded-full border-2 transition-all duration-150
                  ${colour === c ? "border-(--fg) scale-110" : "border-(--border) hover:border-(--muted)"}
                `}
                style={{ background: COLOUR_HEX[c.toLowerCase()] ?? "#888" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-[11px] tracking-widest uppercase text-(--muted) mb-3">
            Size — <span className="text-(--fg)">{size}</span>
          </p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`
                  min-w-10 h-10 px-3 text-[12px] border transition-colors duration-150
                  ${
                    size === s
                      ? "border-(--fg) bg-(--fg) text-(--bg)"
                      : "border-(--border) text-(--muted) hover:border-(--fg) hover:text-(--fg)"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to cart */}
      <div className="flex gap-3">
        {/* Qty stepper */}
        <div className="flex border border-(--border)">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-12 flex items-center justify-center text-(--muted) hover:text-(--fg) transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="w-10 h-12 flex items-center justify-center text-[13px] text-(--fg) border-x border-(--border)">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={qty >= product.stock}
            className="w-10 h-12 flex items-center justify-center text-(--muted) hover:text-(--fg) transition-colors disabled:opacity-30"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className={`
            flex-1 h-12 text-[12px] tracking-widest uppercase font-medium
            transition-all duration-200
            ${
              outOfStock
                ? "bg-(--surface) text-(--muted) cursor-not-allowed"
                : added
                  ? "bg-(--gold) text-white"
                  : "bg-(--fg) text-(--bg) hover:opacity-85"
            }
          `}
        >
          {outOfStock
            ? "Out of stock"
            : added
              ? "Added to bag ✓"
              : "Add to bag"}
        </button>
      </div>

      {/* Buy Now */}
      {!outOfStock && (
        <button
          onClick={handleBuyNow}
          disabled={buyLoading}
          className="w-full h-12 text-[12px] tracking-widest uppercase font-medium border border-(--fg) text-(--fg) hover:bg-(--fg) hover:text-(--bg) disabled:opacity-50 transition-all duration-200"
        >
          {buyLoading ? "Redirecting…" : "Buy now"}
        </button>
      )}

      {/* Inline shipping form for Buy Now */}
      {showShipping && !outOfStock && (
        <div className="border border-(--border) p-4 space-y-3 mt-1">
          <p className="text-[11px] tracking-widest uppercase text-(--muted)">Shipping details</p>
          {[
            { key: "fullName", label: "Full name *", placeholder: "Ada Okafor" },
            { key: "email", label: "Email *", placeholder: "ada@email.com" },
            { key: "phone", label: "Phone", placeholder: "+234 800 000 0000" },
            { key: "address", label: "Address *", placeholder: "123 Victoria Island" },
            { key: "city", label: "City *", placeholder: "Lagos" },
            { key: "state", label: "State", placeholder: "Lagos State" },
            { key: "postcode", label: "Postcode", placeholder: "100001" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] tracking-wide uppercase text-(--muted) mb-1">{label}</label>
              <input
                type={key === "email" ? "email" : "text"}
                value={shipping[key as keyof typeof EMPTY_SHIPPING]}
                onChange={(e) => setField(key as keyof typeof EMPTY_SHIPPING, e.target.value)}
                placeholder={placeholder}
                className="w-full h-9 px-3 text-sm bg-(--bg) border border-(--border) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-(--gold) transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-[10px] tracking-wide uppercase text-(--muted) mb-1">Country</label>
            <select
              value={shipping.country}
              onChange={(e) => setField("country", e.target.value)}
              className="w-full h-9 px-3 text-sm bg-(--bg) border border-(--border) text-(--fg) focus:outline-none focus:border-(--gold) transition-colors"
            >
              <option value="NG">Nigeria</option>
              <option value="GH">Ghana</option>
              <option value="KE">Kenya</option>
              <option value="ZA">South Africa</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          {buyError && <p className="text-[12px] text-red-500">{buyError}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleBuyNow}
              disabled={buyLoading}
              className="flex-1 h-10 text-[11px] tracking-widest uppercase font-medium bg-(--fg) text-(--bg) hover:opacity-85 disabled:opacity-50 transition-opacity"
            >
              {buyLoading ? "Redirecting…" : "Confirm & pay"}
            </button>
            <button
              onClick={() => { setShowShipping(false); setBuyError(""); }}
              className="px-4 h-10 text-[11px] uppercase tracking-wide text-(--muted) border border-(--border) hover:text-(--fg) transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
