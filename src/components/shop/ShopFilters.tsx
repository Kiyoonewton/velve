"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface ShopFiltersProps {
  categories: { name: string; slug: string }[];
  colours: string[];
  activeCategory?: string;
  activeColour?: string;
  activeSort?: string;
  search?: string;
  mobile?: boolean;
}

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low" },
  { value: "price-desc", label: "Price: high" },
];

const COLOUR_HEX: Record<string, string> = {
  Gold: "#C9A96E",
  Silver: "#C0C0C0",
  Black: "#1A1A1A",
  White: "#F5F5F0",
  Multi: "conic-gradient(#C9A96E,#E91E8C,#2980B9,#27AE60,#C9A96E)",
  Pink: "#E91E8C",
  Blue: "#2980B9",
  Green: "#27AE60",
};

export default function ShopFilters({
  categories,
  colours,
  activeCategory,
  activeColour,
  activeSort,
  search,
  mobile,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(search ?? "");

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const clearAll = () => router.push(pathname);

  const hasFilters = activeCategory || activeColour || activeSort || search;

  const filterContent = (
    <div className="space-y-7">
      {/* Search */}
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-(--muted) mb-3">
          Search
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParam("search", searchVal || null);
          }}
        >
          <div className="flex gap-1">
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Crystal, beaded…"
              className="
                flex-1 h-8 px-2.5 text-[12px]
                bg-(--bg) border border-(--border)
                text-(--fg) placeholder:text-(--muted)
                focus:outline-none focus:border-(--gold)
                transition-colors
              "
            />
            <button
              type="submit"
              className="h-8 px-2.5 bg-(--fg) text-(--bg) text-[11px] hover:opacity-85 transition-opacity"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Sort */}
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-(--muted) mb-3">
          Sort by
        </p>
        <div className="flex flex-col gap-1.5">
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setParam("sort", value || null)}
              className={`
                text-left text-[13px] transition-colors duration-150
                ${
                  (activeSort ?? "") === value
                    ? "text-(--gold) font-medium"
                    : "text-(--muted) hover:text-(--fg)"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-(--muted) mb-3">
          Category
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setParam("category", null)}
            className={`text-left text-[13px] transition-colors ${!activeCategory ? "text-(--gold) font-medium" : "text-(--muted) hover:text-(--fg)"}`}
          >
            All
          </button>
          {categories.map(({ name, slug }) => (
            <button
              key={slug}
              onClick={() =>
                setParam("category", slug === activeCategory ? null : slug)
              }
              className={`text-left text-[13px] transition-colors ${activeCategory === slug ? "text-(--gold) font-medium" : "text-(--muted) hover:text-(--fg)"}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Colours */}
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-(--muted) mb-3">
          Colour
        </p>
        <div className="flex flex-wrap gap-2">
          {colours.map((colour) => (
            <button
              key={colour}
              title={colour}
              onClick={() =>
                setParam("colour", colour === activeColour ? null : colour)
              }
              className={`
                w-6 h-6 rounded-full border-2 transition-all duration-150
                ${activeColour === colour ? "border-(--fg) scale-110" : "border-transparent hover:border-(--muted)"}
              `}
              style={{ background: COLOUR_HEX[colour] ?? "#888" }}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-[11px] tracking-[0.08em] uppercase text-(--muted) hover:text-(--fg) transition-colors border-b border-(--border) pb-0.5"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  if (mobile) {
    return (
      <div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-1.5 shrink-0 px-3 h-8 text-[11px] tracking-wide uppercase border border-(--border) text-(--muted) hover:text-(--fg) transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            Filters
          </button>
          {/* Active filter pills */}
          {activeCategory && (
            <button
              onClick={() => setParam("category", null)}
              className="shrink-0 flex items-center gap-1 px-2.5 h-7 text-[11px] bg-(--fg) text-(--bg) rounded-full"
            >
              {categories.find((c) => c.slug === activeCategory)?.name} ×
            </button>
          )}
          {activeColour && (
            <button
              onClick={() => setParam("colour", null)}
              className="shrink-0 flex items-center gap-1.5 px-2.5 h-7 text-[11px] bg-(--fg) text-(--bg) rounded-full"
            >
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ background: COLOUR_HEX[activeColour] ?? "#888" }}
              />
              {activeColour} ×
            </button>
          )}
          {SORT_OPTIONS.filter((s) => s.value && s.value === activeSort).map(
            (s) => (
              <button
                key={s.value}
                onClick={() => setParam("sort", null)}
                className="shrink-0 flex items-center gap-1 px-2.5 h-7 text-[11px] bg-(--fg) text-(--bg) rounded-full"
              >
                {s.label} ×
              </button>
            ),
          )}
        </div>

        {mobileOpen && (
          <div className="mt-4 p-5 border border-(--border) bg-(--surface) rounded-lg">
            {filterContent}
          </div>
        )}
      </div>
    );
  }

  return filterContent;
}
