"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return <div className="aspect-square bg-(--surface) rounded-sm" />;
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-16 shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                relative aspect-square overflow-hidden
                border transition-colors duration-150
                ${active === i ? "border-(--fg)" : "border-(--border) hover:border-(--muted)"}
              `}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${name} view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-3/4 overflow-hidden bg-(--surface)">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
