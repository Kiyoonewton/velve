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
  const addItem = useCartStore((s) => s.addItem);

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
    </div>
  );
}
