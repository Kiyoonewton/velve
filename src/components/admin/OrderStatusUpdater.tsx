"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  orderId: string;
  currentStatus: string;
  statuses: string[];
  statusStyles: Record<string, string>;
  trackingNumber?: string;
  isTrackingField?: boolean;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  statuses,
  statusStyles,
  trackingNumber = "",
  isTrackingField = false,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(trackingNumber);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setStatus(newStatus);
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    setSaving(false);
    flashSaved();
  }

  async function updateTracking() {
    if (tracking === trackingNumber) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("orders")
      .update({ tracking_number: tracking || null })
      .eq("id", orderId);
    setSaving(false);
    flashSaved();
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (isTrackingField) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          onBlur={updateTracking}
          placeholder="Add tracking"
          className="
            h-7 px-2 text-[12px] w-28
            bg-[var(--bg)] border border-[var(--border)]
            text-[var(--fg)] placeholder:text-[var(--muted)]
            focus:outline-none focus:border-[var(--gold)]
            transition-colors
          "
        />
        {saved && (
          <span className="text-[10px] text-[var(--color-text-success)]">
            Saved
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
        disabled={saving}
        className={`
          h-7 pl-2 pr-6 text-[11px] font-medium rounded-full
          border-0 cursor-pointer appearance-none
          focus:outline-none focus:ring-1 focus:ring-[var(--gold)]
          disabled:opacity-60 transition-colors
          ${statusStyles[status] ?? ""}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center",
        }}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {saved && (
        <span className="text-[10px] text-[var(--color-text-success)]">
          Saved
        </span>
      )}
    </div>
  );
}
