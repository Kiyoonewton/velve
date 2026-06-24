"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-[var(--gold)] tracking-wide">
        Thank you — you are on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="
          flex-1 h-11 px-4 text-sm
          bg-[var(--bg)] border border-[var(--border)]
          text-[var(--fg)] placeholder:text-[var(--muted)]
          focus:outline-none focus:border-[var(--gold)]
          transition-colors duration-200
        "
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="
          h-11 px-5 text-[11px] tracking-[0.1em] uppercase font-medium
          bg-[var(--fg)] text-[var(--bg)]
          hover:opacity-85 disabled:opacity-50
          transition-opacity duration-200 whitespace-nowrap
        "
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
