"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/admin/products/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setError(`Failed to upload ${file.name}: ${json.error}`);
        continue;
      }

      uploaded.push(json.url);
    }

    onChange([...value, ...uploaded]);
    setUploading(false);
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  function move(from: number, to: number) {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, i) => (
            <div key={url} className="relative group">
              <div className="relative aspect-square bg-(--bg) rounded overflow-hidden border border-(--border)">
                <Image src={url} alt="" fill className="object-cover" sizes="150px" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider bg-(--fg) text-(--bg) px-1.5 py-0.5 rounded">
                    Hero
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    className="text-white text-xs bg-black/50 rounded px-1.5 py-1 hover:bg-black/70"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    className="text-white text-xs bg-black/50 rounded px-1.5 py-1 hover:bg-black/70"
                    title="Move right"
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="text-white text-xs bg-red-600/80 rounded px-1.5 py-1 hover:bg-red-600"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="
          w-full h-24 border-2 border-dashed border-(--border)
          flex flex-col items-center justify-center gap-1
          text-(--muted) hover:text-(--fg) hover:border-(--fg)
          transition-colors duration-200 rounded
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {uploading ? (
          <span className="text-[13px]">Uploading…</span>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[13px]">Click to upload images</span>
            <span className="text-[11px]">PNG, JPG, WEBP — first image is the hero</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-[12px] text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
