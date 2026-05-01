"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    src: "/images/white-dotted-ball.jpeg",
    alt: "Pearl beaded bag — Velve",
    heading: "Crafted for you",
    sub: "Shop our perfect match",
  },
  {
    src: "/images/pink-fluffy.jpeg",
    alt: "Pink fluffy beaded bag — Velve",
    heading: "Worn with pride",
    sub: "Handcrafted with love",
  },
];

const INTERVAL = 4000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
      {/* Images — crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={s.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Text overlay — bottom right */}
      <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-14 text-right z-10">
        <h1
          key={slide.heading}
          className="font-script leading-tight transition-all duration-500"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)", color: "#1a1410" }}
        >
          {slide.heading}
        </h1>
        <p
          className="font-script mt-1 transition-all duration-500"
          style={{ fontSize: "clamp(1rem, 2vw, 1.6rem)", color: "#555" }}
        >
          {slide.sub}
        </p>
        <Link
          href="/shop"
          className="inline-block mt-4 font-script text-[1rem] border-b border-(--fg) text-(--fg) hover:text-(--gold) hover:border-(--gold) transition-colors duration-200 pb-0.5"
        >
          Shop now →
        </Link>
      </div>

      {/* Slide controls — bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="text-(--fg)/60 hover:text-(--fg) transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-2.5 h-2.5 bg-(--fg)"
                : "w-2 h-2 bg-(--fg)/30"
            }`}
          />
        ))}

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next slide"
          className="text-(--fg)/60 hover:text-(--fg) transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Pause / Play */}
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className="text-(--fg)/60 hover:text-(--fg) transition-colors ml-1"
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
