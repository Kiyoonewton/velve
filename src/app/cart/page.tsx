"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } =
    useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState<{
    code: string;
    type: string;
    value: number;
    amount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = total();
  const discountAmt = discount?.amount ?? 0;
  const orderTotal = Math.max(0, subtotal - discountAmt);

  async function applyPromo() {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setDiscount(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", promoCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !data) {
      setPromoError("Invalid or expired code.");
      setPromoLoading(false);
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setPromoError("This code has expired.");
      setPromoLoading(false);
      return;
    }
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      setPromoError("This code has reached its limit.");
      setPromoLoading(false);
      return;
    }
    if (data.minimum_order && subtotal < data.minimum_order) {
      setPromoError(`Minimum order of $${data.minimum_order} required.`);
      setPromoLoading(false);
      return;
    }

    const amount =
      data.type === "percentage"
        ? (subtotal * data.value) / 100
        : Math.min(data.value, subtotal);

    setDiscount({
      code: data.code,
      type: data.type,
      value: data.value,
      amount,
    });
    setPromoLoading(false);
  }

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 text-center">
        <p className="font-serif text-3xl text-fg mb-3">Your bag is empty</p>
        <p className="text-sm text-muted mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/shop"
          className="inline-block px-7 py-3 text-[11px] tracking-widest uppercase bg-fg text-bg hover:opacity-85 transition-opacity"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-serif text-3xl text-fg mb-10">Your bag</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-12">
        {/* Items */}
        <div>
          <div className="divide-y divide-border">
            {items.map((item) => {
              const key = `${item.id}-${item.colour}-${item.size}`;
              return (
                <div key={key} className="flex gap-5 py-6">
                  {/* Image */}
                  <div className="relative w-24 h-32 shrink-0 bg-surface overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[16px] text-fg leading-snug mb-1">
                      {item.name}
                    </p>
                    <div className="flex gap-3 text-[11px] text-muted mb-4">
                      {item.colour && <span>{item.colour}</span>}
                      {item.size && <span>{item.size}</span>}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.colour,
                              item.size,
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-fg transition-colors"
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-[13px] text-fg border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.colour,
                              item.size,
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-fg transition-colors"
                        >
                          <svg
                            width="10"
                            height="10"
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

                      <div className="flex items-center gap-4">
                        <span className="text-[14px] font-medium text-fg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            removeItem(item.id, item.colour, item.size)
                          }
                          className="text-muted hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={clearCart}
            className="mt-4 text-[11px] tracking-wide uppercase text-muted hover:text-red-500 transition-colors"
          >
            Clear bag
          </button>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-surface border border-border p-6 sticky top-24">
            <h2 className="font-serif text-xl text-fg mb-6">Order summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Subtotal</span>
                <span className="text-fg">${subtotal.toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-green-600">
                    {discount.code} (
                    {discount.type === "percentage"
                      ? `${discount.value}%`
                      : `$${discount.value}`}{" "}
                    off)
                  </span>
                  <span className="text-green-600">
                    -${discountAmt.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Shipping</span>
                <span className="text-muted">
                  {subtotal >= 150 ? "Free" : "Calculated at checkout"}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium text-fg">Total</span>
                <span className="font-serif text-xl text-fg">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo code */}
            {!discount ? (
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    placeholder="Promo code"
                    className="
                      flex-1 h-10 px-3 text-[12px]
                      bg-bg border border-border
                      text-fg placeholder:text-muted
                      focus:outline-none focus:border-gold
                      transition-colors uppercase
                    "
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoLoading}
                    className="h-10 px-4 text-[11px] uppercase tracking-wide border border-border text-muted hover:text-fg hover:border-fg transition-colors disabled:opacity-50"
                  >
                    {promoLoading ? "…" : "Apply"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-500 mt-1.5">
                    {promoError}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-5 flex items-center justify-between text-[12px] p-2.5 bg-green-50 dark:bg-green-950/30">
                <span className="text-green-600">
                  Code {discount.code} applied
                </span>
                <button
                  onClick={() => setDiscount(null)}
                  className="text-green-600 hover:opacity-70"
                >
                  Remove
                </button>
              </div>
            )}

            <Link
              href={`/checkout${discount ? `?code=${discount.code}` : ""}`}
              className="
                block w-full py-3.5 text-center
                text-[12px] tracking-widest uppercase font-medium
                bg-fg text-bg
                hover:opacity-85 transition-opacity
              "
            >
              Proceed to checkout
            </Link>

            <Link
              href="/shop"
              className="block text-center mt-4 text-[11px] uppercase tracking-wide text-muted hover:text-fg transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
