"use client";

import { useState } from "react";

interface Props {
  orderId: string;
  currentStatus: string;
  statuses: string[];
  statusStyles: Record<string, string>;
  trackingNumber?: string;
  isTrackingField?: boolean;
}

const CANCELLABLE = ["pending", "paid", "processing"];

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
  const [confirming, setConfirming] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setStatus(newStatus);
    await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    setSaving(false);
    flashSaved();
  }

  async function confirmCancel() {
    setConfirming(false);
    setSaving(true);
    setStatus("refunded");
    await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: "cancelled" }),
    });
    setSaving(false);
    flashSaved();
  }

  async function updateTracking() {
    if (tracking === trackingNumber) return;
    setSaving(true);
    await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status, trackingNumber: tracking }),
    });
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

  // Filter out cancelled from the dropdown — it has its own button below
  const dropdownStatuses = statuses.filter((s) => s !== "cancelled");
  const isCancellable = CANCELLABLE.includes(status);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={saving || status === "refunded" || status === "cancelled"}
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
          {dropdownStatuses.map((s) => (
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

    </div>
  );
}

export function CancelOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const isCancellable = CANCELLABLE.includes(currentStatus) && !done;

  async function confirmCancel() {
    setConfirming(false);
    setSaving(true);
    await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: "cancelled" }),
    });
    setSaving(false);
    setDone(true);
  }

  if (!isCancellable) {
    return <span className="text-[11px] text-[var(--muted)]">—</span>;
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        disabled={saving}
        className="text-[11px] text-red-500 hover:text-red-700 hover:underline disabled:opacity-40 transition-colors"
      >
        {saving ? "Cancelling…" : "Cancel order"}
      </button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-serif text-lg text-[var(--fg)] mb-2">Cancel this order?</h3>
            <p className="text-[13px] text-[var(--muted)] mb-6 leading-relaxed">
              This will cancel the order and automatically trigger a full refund via Stripe. The customer will be notified by email. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-2 text-[12px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
              >
                Keep order
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 text-[12px] bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Yes, cancel & refund
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
