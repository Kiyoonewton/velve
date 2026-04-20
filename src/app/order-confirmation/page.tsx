"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const sessionId = searchParams.get("session_id");
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (sessionId && !cleared) {
      clearCart();
      setCleared(true);
    }
    if (!sessionId) router.replace("/shop");
  }, [sessionId, cleared, clearCart, router]);

  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      {/* Checkmark */}
      <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-8">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-3">
        Order confirmed
      </p>
      <h1 className="font-serif text-4xl text-fg mb-4">
        Thank you for your order
      </h1>
      <p className="text-sm text-muted leading-relaxed mb-10">
        We've received your order and are getting it ready. You'll receive a
        confirmation email shortly with your order details.
      </p>

      <div className="bg-surface border border-border p-5 mb-10 text-left text-[13px] space-y-2">
        <p className="text-muted">
          Allow <span className="text-fg">3–5 business days</span> for your
          handcrafted piece to be completed.
        </p>
        <p className="text-muted">
          Need help?{" "}
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            WhatsApp us
          </a>{" "}
          or email{" "}
          <a href="mailto:hello@velve.co" className="text-gold hover:underline">
            hello@velve.co
          </a>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/shop"
          className="px-7 py-3 text-[11px] tracking-widest uppercase bg-fg text-bg hover:opacity-85 transition-opacity"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
