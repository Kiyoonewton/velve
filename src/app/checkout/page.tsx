"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";

type Step = "shipping" | "review";

interface ShippingData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

const EMPTY_SHIPPING: ShippingData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "NG",
  postcode: "",
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams.get("code");

  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const orderTotal = total();

  function setField(key: keyof ShippingData, value: string) {
    setShipping((s) => ({ ...s, [key]: value }));
  }

  async function handleCheckout() {
    if (!items.length) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping, promoCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.url)
        throw new Error(data.error ?? "Checkout failed");

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <p className="font-serif text-2xl text-(--fg) mb-4">
          Your bag is empty
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="text-[11px] uppercase tracking-wide text-(--gold) border-b border-(--gold) pb-0.5"
        >
          Continue shopping →
        </button>
      </div>
    );
  }

  const inputClass = `
    w-full h-10 px-3 text-sm
    bg-[var(--bg)] border border-[var(--border)]
    text-[var(--fg)] placeholder:text-[var(--muted)]
    focus:outline-none focus:border-[var(--gold)]
    transition-colors duration-200
  `;
  const labelClass =
    "block text-[11px] tracking-[0.08em] uppercase text-[var(--muted)] mb-1.5";

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-10">
        {(["shipping", "review"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            {i > 0 && <div className="w-10 h-px bg-(--border)" />}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${step === s || (s === "shipping" && step === "review") ? "bg-(--fg) text-(--bg)" : "bg-(--surface) text-(--muted) border border-(--border)"}`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[12px] tracking-wide capitalize ${step === s ? "text-(--fg) font-medium" : "text-(--muted)"}`}
              >
                {s}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-12">
        {/* Left — form */}
        <div>
          {step === "shipping" && (
            <div>
              <h2 className="font-serif text-2xl text-(--fg) mb-6">
                Shipping details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full name *</label>
                  <input
                    value={shipping.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    className={inputClass}
                    placeholder="Ada Okafor"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setField("email", e.target.value)}
                      className={inputClass}
                      placeholder="ada@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      value={shipping.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={inputClass}
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Address *</label>
                  <input
                    value={shipping.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className={inputClass}
                    placeholder="123 Victoria Island"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      value={shipping.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className={inputClass}
                      placeholder="Lagos"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      value={shipping.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className={inputClass}
                      placeholder="Lagos State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Country</label>
                    <select
                      value={shipping.country}
                      onChange={(e) => setField("country", e.target.value)}
                      className={`${inputClass} cursor-pointer`}
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
                  <div>
                    <label className={labelClass}>Postcode</label>
                    <input
                      value={shipping.postcode}
                      onChange={(e) => setField("postcode", e.target.value)}
                      className={inputClass}
                      placeholder="100001"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (
                    !shipping.fullName ||
                    !shipping.email ||
                    !shipping.address ||
                    !shipping.city
                  ) {
                    setError("Please fill in all required fields.");
                    return;
                  }
                  setError("");
                  setStep("review");
                }}
                className="mt-8 w-full py-3.5 text-[12px] tracking-widest uppercase font-medium bg-(--fg) text-(--bg) hover:opacity-85 transition-opacity"
              >
                Continue to review
              </button>
              {error && (
                <p className="text-[12px] text-(--color-text-danger) mt-3">
                  {error}
                </p>
              )}
            </div>
          )}

          {step === "review" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-(--fg)">
                  Review & pay
                </h2>
                <button
                  onClick={() => setStep("shipping")}
                  className="text-[11px] uppercase tracking-wide text-(--muted) hover:text-(--fg) transition-colors"
                >
                  Edit details
                </button>
              </div>

              {/* Shipping summary */}
              <div className="bg-(--surface) border border-(--border) p-4 mb-6 text-[13px] text-(--muted) space-y-1">
                <p className="text-(--fg) font-medium">{shipping.fullName}</p>
                <p>
                  {shipping.address}, {shipping.city}
                  {shipping.state ? `, ${shipping.state}` : ""}
                </p>
                <p>
                  {shipping.country} {shipping.postcode}
                </p>
                <p>{shipping.email}</p>
              </div>

              {/* Items summary */}
              <div className="divide-y divide-(--border) mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.colour}-${item.size}`}
                    className="flex justify-between py-3 text-[13px]"
                  >
                    <span className="text-(--fg)">
                      {item.name}
                      {item.colour && (
                        <span className="text-(--muted) ml-2">
                          · {item.colour}
                        </span>
                      )}
                      {item.size && (
                        <span className="text-(--muted) ml-1">
                          · {item.size}
                        </span>
                      )}
                      <span className="text-(--muted) ml-2">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="text-(--fg) font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-[12px] text-(--color-text-danger) mb-4">
                  {error}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 text-[12px] tracking-widest uppercase font-medium bg-(--fg) text-(--bg) hover:opacity-85 disabled:opacity-50 transition-opacity"
              >
                {loading
                  ? "Redirecting to payment…"
                  : `Pay $${orderTotal.toFixed(2)} securely`}
              </button>
              <p className="text-center text-[11px] text-(--muted) mt-3">
                You'll be redirected to Stripe's secure checkout.
              </p>
            </div>
          )}
        </div>

        {/* Right — mini order summary */}
        <div>
          <div className="bg-(--surface) border border-(--border) p-5 sticky top-24">
            <h3 className="text-[12px] tracking-widest uppercase text-(--muted) mb-4">
              Order
            </h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.colour}-${item.size}`}
                  className="flex gap-3"
                >
                  <div className="w-12 h-16 bg-(--border) shrink-0 overflow-hidden relative">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-(--fg) leading-snug truncate">
                      {item.name}
                    </p>
                    {item.colour && (
                      <p className="text-[11px] text-(--muted)">
                        {item.colour}
                      </p>
                    )}
                    <p className="text-[12px] text-(--fg) mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-(--border) pt-3 flex justify-between">
              <span className="text-[12px] text-(--muted)">Total</span>
              <span className="font-serif text-lg text-(--fg)">
                ${orderTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
