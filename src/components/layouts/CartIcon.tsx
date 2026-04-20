"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function CartIcon() {
  const count = useCartStore((s: { items: { quantity: number }[] }) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );

  return (
    <Link
      href="/cart"
      aria-label={`Cart — ${count} item${count !== 1 ? "s" : ""}`}
      className="
        relative w-8 h-8 flex items-center justify-center
        text-[var(--muted)] hover:text-[var(--fg)]
        transition-colors duration-200
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            min-w-[16px] h-4 px-[3px]
            flex items-center justify-center
            text-[10px] font-medium leading-none
            bg-[var(--gold)] text-white
            rounded-full
          "
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
