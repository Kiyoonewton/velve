import { createClient } from "@/lib/supabase/server";
import NewsletterExport from "@/components/admin/NewsletterExport";

export const metadata = { title: "Newsletter" };

export default async function AdminNewsletterPage() {
  const supabase = await createClient();
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, is_active, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  const emails = (subscribers ?? [])
    .filter((s) => s.is_active)
    .map((s) => s.email);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--fg)]">Newsletter</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {count ?? 0} subscribers total
          </p>
        </div>
        <NewsletterExport emails={emails} />
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        {!subscribers?.length ? (
          <p className="text-sm text-[var(--muted)] p-6 text-center">
            No subscribers yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Email", "Status", "Joined"].map((h) => (
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
              {subscribers.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-5 py-3 text-[13px] text-[var(--fg)]">
                    {s.email}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${s.is_active ? "bg-[var(--color-background-success)] text-[var(--color-text-success)]" : "bg-[var(--color-background-warning)] text-[var(--color-text-warning)]"}`}
                    >
                      {s.is_active ? "Subscribed" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--muted)]">
                    {new Date(s.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
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
