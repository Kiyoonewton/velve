"use client";

import { useState } from "react";
import type { Metadata } from "next";

const SUBJECTS = [
  "General enquiry",
  "Custom order",
  "Order status",
  "Wholesale / collaboration",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass = `
    w-full h-10 px-3 text-sm
    bg-bg border border-border
    text-fg placeholder:text-muted
    focus:outline-none focus:border-gold
    transition-colors duration-200
  `;
  const labelClass =
    "block text-[11px] tracking-[0.08em] uppercase text-muted mb-1.5";

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <div className="mb-12">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
          Get in touch
        </p>
        <h1 className="font-serif text-5xl text-fg">Contact us</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-16">
        {/* Contact info */}
        <div className="order-2 lg:order-1 space-y-10">
          {/* WhatsApp */}
          <div className="border-t border-border pt-8">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-4">
              Quickest response
            </p>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-3 px-5 py-3
                border border-border text-fg
                hover:border-gold hover:text-gold
                transition-colors duration-200
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-[13px] tracking-wide">WhatsApp us</span>
            </a>
            <p className="text-[11px] text-muted mt-2 ml-1">
              Usually replies within a few hours
            </p>
          </div>

          {/* Email */}
          <div className="border-t border-border pt-8">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-3">
              Email
            </p>
            <a
              href="mailto:hello@velve.co"
              className="text-[14px] text-fg hover:text-gold transition-colors"
            >
              hello@velve.co
            </a>
          </div>

          {/* Social */}
          <div className="border-t border-border pt-8">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-4">
              Follow us
            </p>
            <div className="flex gap-4">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com/velve",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "TikTok",
                  href: "https://tiktok.com/@velve",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.18 8.18 0 004.78 1.52V7.01a4.85 4.85 0 01-1.01-.32z" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-10 h-10 flex items-center justify-center
                    border border-border
                    text-muted hover:text-gold hover:border-gold
                    transition-colors duration-200
                  "
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Hours / note */}
          <div className="border-t border-border pt-8">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-3">
              Custom orders
            </p>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              We love making pieces to order. Share your colours, occasion, and
              vision — we'll bring it to life. Allow 2–3 weeks for custom
              pieces.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="order-1 lg:order-2">
          {status === "sent" ? (
            <div className="border border-border p-8 text-center">
              <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mx-auto mb-5">
                <svg
                  width="18"
                  height="18"
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
              <h3 className="font-serif text-2xl text-fg mb-2">Message sent</h3>
              <p className="text-sm text-muted">
                We'll be in touch within 1–2 business days.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-[11px] uppercase tracking-wide text-muted hover:text-fg transition-colors border-b border-border pb-0.5"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Your name *</label>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass}
                  placeholder="Ada Okafor"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputClass}
                  placeholder="ada@email.com"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={6}
                  required
                  className={`${inputClass} h-auto py-2.5 resize-none`}
                  placeholder="Tell us about your order, custom request, or anything you'd like to know…"
                />
              </div>

              {status === "error" && (
                <p className="text-[12px] text-red-500">
                  Something went wrong. Please try WhatsApp instead.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="
                  w-full py-3.5 text-[12px] tracking-widest uppercase font-medium
                  bg-fg text-bg
                  hover:opacity-85 disabled:opacity-50
                  transition-opacity duration-200
                "
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
