import { createClient } from "@/lib/supabase/server";
import DiscountForm, { DiscountActions } from "@/components/admin/DiscountForm";

export const metadata = { title: "Discounts" };

export default async function AdminDiscountsPage() {
  const supabase = await createClient();
  const { data: codes } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--fg)]">Discount codes</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Create and manage promo codes for the store.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-8">
        <h2 className="text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] mb-4">
          Create new code
        </h2>
        <DiscountForm />
      </div>

      {/* Existing codes */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-medium text-[var(--fg)]">
            Active codes
          </h2>
        </div>
        {!codes?.length ? (
          <p className="text-sm text-[var(--muted)] p-6">
            No codes created yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {[
                  "Code",
                  "Type",
                  "Value",
                  "Min. order",
                  "Usage",
                  "Expires",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] tracking-[0.1em] uppercase text-[var(--muted)] px-5 py-3 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {codes.map((code) => (
                <tr
                  key={code.id}
                  className="hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-[13px] font-medium text-[var(--fg)]">
                    {code.code}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--muted)] capitalize">
                    {code.type}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-[var(--fg)]">
                    {code.type === "percentage"
                      ? `${code.value}%`
                      : `$${Number(code.value).toFixed(2)}`}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--muted)]">
                    {code.minimum_order > 0
                      ? `$${Number(code.minimum_order).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--muted)]">
                    {code.usage_count}
                    {code.usage_limit ? `/${code.usage_limit}` : ""}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--muted)]">
                    {code.expires_at
                      ? new Date(code.expires_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${code.is_active ? "bg-[var(--color-background-success)] text-[var(--color-text-success)]" : "bg-[var(--color-background-warning)] text-[var(--color-text-warning)]"}`}
                    >
                      {code.is_active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <DiscountActions id={code.id} isActive={code.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
