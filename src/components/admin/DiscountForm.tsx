"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DiscountForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minimum_order: "",
    usage_limit: "",
    expires_at: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { error: sbError } = await supabase.from("discount_codes").insert({
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      minimum_order: form.minimum_order ? parseFloat(form.minimum_order) : 0,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    });

    if (sbError) {
      setError(sbError.message);
      setSaving(false);
      return;
    }
    setForm({
      code: "",
      type: "percentage",
      value: "",
      minimum_order: "",
      usage_limit: "",
      expires_at: "",
      is_active: true,
    });
    router.refresh();
    setSaving(false);
  }

  const inputClass =
    "h-9 px-3 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors w-full";
  const labelClass =
    "block text-[11px] tracking-[0.08em] uppercase text-[var(--muted)] mb-1.5";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelClass}>Code *</label>
          <input
            value={form.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            className={inputClass}
            placeholder="VELVE20"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Type *</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed amount ($)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Value *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.value}
            onChange={(e) => set("value", e.target.value)}
            className={inputClass}
            placeholder={form.type === "percentage" ? "20" : "10.00"}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Min. order ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.minimum_order}
            onChange={(e) => set("minimum_order", e.target.value)}
            className={inputClass}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClass}>Usage limit</label>
          <input
            type="number"
            min="1"
            value={form.usage_limit}
            onChange={(e) => set("usage_limit", e.target.value)}
            className={inputClass}
            placeholder="Unlimited"
          />
        </div>
        <div>
          <label className={labelClass}>Expires</label>
          <input
            type="date"
            value={form.expires_at}
            onChange={(e) => set("expires_at", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-text-danger)] mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2 text-[11px] tracking-[0.1em] uppercase font-medium bg-[var(--fg)] text-[var(--bg)] hover:opacity-85 disabled:opacity-50 transition-opacity"
      >
        {saving ? "Creating…" : "Create code"}
      </button>
    </form>
  );
}

export function DiscountActions({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("discount_codes")
      .update({ is_active: !isActive })
      .eq("id", id);
    router.refresh();
    setLoading(false);
  }

  async function remove() {
    if (!confirm("Delete this discount code?")) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("discount_codes").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={loading}
        className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors disabled:opacity-50"
      >
        {isActive ? "Pause" : "Activate"}
      </button>
      <button
        onClick={remove}
        disabled={loading}
        className="text-[11px] text-[var(--muted)] hover:text-[var(--color-text-danger)] transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

export default DiscountForm;
