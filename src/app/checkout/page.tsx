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

function PaymentLinkModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-(--bg) rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-(--border)">
          <h2 className="font-serif text-xl text-(--fg)">
            Payment link
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-(--muted) hover:text-(--fg) transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-[13px] text-(--muted) leading-[1.7] mb-5">
            Please copy this link and paste it in your browser to complete payment.
          </p>

          {/* URL copy row */}
          <div className="flex items-center gap-2 border border-(--border) rounded px-3 py-2.5 bg-(--surface) mb-6">
            <p className="flex-1 text-[12px] text-(--fg) truncate font-mono select-all">
              {url}
            </p>
            <button
              onClick={copy}
              className="shrink-0 text-(--muted) hover:text-(--gold) transition-colors"
              aria-label="Copy link"
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>

          {/* Payment method tabs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(["card", "wallet"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex flex-col items-center gap-1.5 py-3 border rounded transition-colors duration-200 ${
                  paymentMethod === method
                    ? "border-(--fg) bg-(--surface)"
                    : "border-(--border) text-(--muted)"
                }`}
              >
                {method === "card" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <path d="M1 10h22" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V22H4V12" />
                    <path d="M22 7H2v5h20V7z" />
                    <path d="M12 22V7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                )}
                <span className="text-[11px] tracking-wide capitalize">
                  Pay with {method}
                </span>
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 text-center text-[12px] tracking-widest uppercase font-medium bg-(--fg) text-(--bg) hover:opacity-85 transition-opacity rounded"
          >
            Confirm payment
          </a>

          {/* Fallback link */}
          <div className="mt-4 text-center">
            <button
              onClick={copy}
              className="text-[11px] text-(--muted) underline underline-offset-2 hover:text-(--fg) transition-colors"
            >
              Payment button not working?
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-(--muted) mt-3">
            Secure payment with Stripe. Cancel any time.
          </p>
        </div>
      </div>
    </div>
  );
}

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

  const { items, total } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

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

      setPaymentUrl(data.url);
      setLoading(false);
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

  const inputClass =
    "w-full h-10 px-3 text-sm bg-(--bg) border border-(--border) text-(--fg) placeholder:text-(--muted) focus:outline-none focus:border-(--gold) transition-colors duration-200";
  const labelClass =
    "block text-[11px] tracking-[0.08em] uppercase text-(--muted) mb-1.5";

  return (
    <>
    {paymentUrl && (
      <PaymentLinkModal url={paymentUrl} onClose={() => setPaymentUrl(null)} />
    )}
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
    </>
  );
}
