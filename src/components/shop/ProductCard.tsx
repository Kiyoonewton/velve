"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  images: string[];
  colours?: string[];
  category?: string;
  is_featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean; // true for above-the-fold cards
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeColour, setActiveColour] = useState(product.colours?.[0] ?? "");
  const addItem = useCartStore((s) => s.addItem);

  const hasSecondImage = product.images.length > 1;
  const isOnSale =
    product.compare_price && product.compare_price > product.price;
  const discount = isOnSale
    ? Math.round(
        ((product.compare_price! - product.price) / product.compare_price!) *
          100,
      )
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate to PDP
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      colour: activeColour,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-[var(--surface)] aspect-[3/4]">
        {/* Primary image */}
        <Image
          src={product.images[0] ?? "/placeholder.jpg"}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`
            object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0,0,1)]
            ${hovered && hasSecondImage ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"}
          `}
        />

        {/* Hover image */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`
              object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0,0,1)]
              ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"}
            `}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span
              className="
              px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-medium
              bg-[var(--gold)] text-white
            "
            >
              Featured
            </span>
          )}
          {isOnSale && (
            <span
              className="
              px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-medium
              bg-[var(--fg)] text-[var(--bg)]
            "
            >
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick add — slides up on hover */}
        <div
          className={`
          absolute bottom-0 left-0 right-0 px-4 py-3
          transition-transform duration-300 ease-[cubic-bezier(0.25,0,0,1)]
          ${hovered ? "translate-y-0" : "translate-y-full"}
        `}
        >
          <button
            onClick={handleAddToCart}
            className={`
              w-full py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium
              transition-all duration-200
              ${
                added
                  ? "bg-[var(--gold)] text-white"
                  : "bg-[var(--bg)]/95 text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
              }
            `}
          >
            {added ? "Added to bag" : "Quick add"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        {/* Colour dots */}
        {product.colours && product.colours.length > 1 && (
          <div className="flex gap-1.5 mb-2.5">
            {product.colours.map((colour) => (
              <button
                key={colour}
                title={colour}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColour(colour);
                }}
                className={`
                  w-3 h-3 rounded-full border transition-all duration-150
                  ${
                    activeColour === colour
                      ? "border-[var(--fg)] scale-110"
                      : "border-[var(--border)] hover:border-[var(--muted)]"
                  }
                `}
                style={{ background: colourToHex(colour) }}
              />
            ))}
          </div>
        )}

        {/* Name */}
        <p
          className="
          font-serif text-[15px] leading-snug tracking-wide text-[var(--fg)]
          group-hover:text-[var(--gold)] transition-colors duration-200
          line-clamp-2
        "
        >
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[13px] font-medium text-[var(--fg)]">
            ${product.price.toFixed(2)}
          </span>
          {isOnSale && (
            <span className="text-[12px] text-[var(--muted)] line-through">
              ${product.compare_price!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Map common colour names to hex swatches
function colourToHex(colour: string): string {
  const map: Record<string, string> = {
    gold: "#C9A96E",
    silver: "#C0C0C0",
    black: "#1A1A1A",
    white: "#F5F5F0",
    red: "#C0392B",
    blue: "#2980B9",
    green: "#27AE60",
    pink: "#E91E8C",
    purple: "#8E44AD",
    brown: "#795548",
    multi: "conic-gradient(#C9A96E, #E91E8C, #2980B9, #27AE60, #C9A96E)",
  };
  return map[colour.toLowerCase()] ?? "#888";
}
