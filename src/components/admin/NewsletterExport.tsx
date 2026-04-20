"use client";

export default function NewsletterExport({ emails }: { emails: string[] }) {
  function downloadCSV() {
    const csv = "Email\n" + emails.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `velve-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={downloadCSV}
      disabled={emails.length === 0}
      className="
        flex items-center gap-2 px-4 py-2.5
        text-[11px] tracking-[0.08em] uppercase font-medium
        border border-[var(--border)] text-[var(--muted)]
        hover:text-[var(--fg)] hover:border-[var(--fg)]
        disabled:opacity-40 transition-colors
      "
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export CSV ({emails.length})
    </button>
  );
}
