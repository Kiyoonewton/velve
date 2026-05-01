"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartIcon from "./CartIcon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href.split("?")[0];

  return (
    <>
      {/* ── Top announcement strip ── */}
      <div className="bg-(--surface) border-b border-(--border) px-5 py-2 flex items-center justify-between">
        <span className="hidden sm:block text-[12px] text-(--muted)" />
        <p className="flex-1 text-center font-script text-[1rem] text-(--fg)">
          Well deserved retail therapy ✨
        </p>
        <span className="hidden sm:block font-script text-[1rem] text-(--muted) whitespace-nowrap">
          Worldwide shipping
        </span>
      </div>

      {/* ── Main navbar ── */}
      <header className="sticky top-0 z-50 bg-(--bg) border-b border-(--border)">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-15 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="font-script text-[1.75rem] text-(--fg) hover:text-(--gold) transition-colors duration-200 shrink-0 leading-none"
          >
            Velve' Bags
          </Link>

          {/* Desktop nav links — centered */}
          <ul className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    font-serif text-[1.1rem] transition-colors duration-200 pb-0.5 leading-none
                    ${isActive(href)
                      ? "text-(--fg) border-b-2 border-(--fg)"
                      : "text-(--fg) hover:text-(--muted) border-b-2 border-transparent"}
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search */}
            <button
              aria-label="Search"
              className="text-(--muted) hover:text-(--fg) transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              className="text-(--muted) hover:text-(--fg) transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>

            {/* Cart */}
            <CartIcon />

            {/* Mobile hamburger */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col items-center justify-center gap-1.25 text-(--fg) ml-1"
            >
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Second announcement strip ── */}
      <div className="bg-(--bg) border-b border-(--border) px-5 py-2 flex items-center justify-between">
        <span className="hidden sm:block font-script text-[1rem] text-(--muted)" />
        <p className="flex-1 text-center font-script text-[1rem] text-(--fg)">
          Come in, find your perfect match 💕
        </p>
        <span className="hidden sm:block font-script text-[1rem] text-(--muted) whitespace-nowrap">
          Free shipping over $150
        </span>
      </div>

      {/* ── Mobile menu overlay ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-(--bg) border-l border-(--border) flex flex-col pt-8 pb-8 px-8 transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="self-end mb-8 text-(--muted) hover:text-(--fg) transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                  className={`block py-3 border-b border-(--border) font-serif text-2xl transition-all duration-300 ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"} ${isActive(href) ? "text-(--gold)" : "text-(--fg) hover:text-(--gold)"}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <p className="font-script text-2xl text-(--gold)">Velve' Bags</p>
            <p className="text-[11px] text-(--muted) mt-1 tracking-wide">
              Crafted with intention. Worn with pride.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
