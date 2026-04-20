"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import CartIcon from "./CartIcon";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=beaded-bags", label: "Bags" },
  { href: "/shop?category=jewellery", label: "Jewellery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href.split("?")[0];

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${
            scrolled
              ? "bg-bg/95 backdrop-blur-md border-b border-border"
              : "bg-transparent"
          }
        `}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.12em] text-fg hover:text-gold transition-colors duration-200 shrink-0"
          >
            VELVE
          </Link>
          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    relative text-[13px] tracking-[0.06em] uppercase
                    transition-colors duration-200
                    after:absolute after:-bottom-0.75 after:left-0 after:right-0
                    after:h-px after:bg-gold
                    after:transition-transform after:duration-200 after:origin-left
                    ${
                      isActive(href)
                        ? "text-fg after:scale-x-100"
                        : "text-muted hover:text-fg after:scale-x-0 hover:after:scale-x-100"
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Search trigger */}
            <button
              aria-label="Search"
              className="
                w-8 h-8 flex items-center justify-center
                text-muted hover:text-fg
                transition-colors duration-200
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <ThemeToggle />
            <CartIcon />

            {/* Mobile menu toggle */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.25
                text-muted hover:text-fg
                transition-colors duration-200 ml-1
              "
            >
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              />
              <span
                className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300
          ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-fg/20 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Slide-in drawer */}
        <div
          className={`
            absolute top-0 right-0 bottom-0 w-72
            bg-bg border-l border-border
            flex flex-col pt-20 pb-8 px-8
            transition-transform duration-300 ease-[cubic-bezier(0.32,0,0.67,0)]
            ${menuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-6">
            Menu
          </p>

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
                  className={`
                    block py-3 border-b border-border
                    font-serif text-2xl tracking-wide
                    transition-all duration-300
                    ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
                    ${isActive(href) ? "text-gold" : "text-fg hover:text-gold"}
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <p className="text-[11px] text-muted tracking-wider">
              Crafted with intention.
              <br />
              Worn with pride.
            </p>
          </div>
        </div>
      </div>

      {/* Spacer so page content clears the fixed navbar */}
      <div className="h-16" />
    </>
  );
}
