"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProductActions({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[var(--muted)]">Sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[11px] text-[var(--color-text-danger)] hover:underline disabled:opacity-50"
        >
          {loading ? "…" : "Delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)]"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-[11px] text-[var(--muted)] hover:text-[var(--color-text-danger)] transition-colors"
    >
      Delete
    </button>
  );
}
