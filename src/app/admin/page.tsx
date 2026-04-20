import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

async function getStats() {
  const supabase = await createClient();
  const [products, orders, subscribers] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("orders")
      .select("id, total, status, created_at, email", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const revenue = (orders.data ?? [])
    .filter((o) =>
      ["paid", "processing", "shipped", "delivered"].includes(o.status),
    )
    .reduce((acc, o) => acc + Number(o.total), 0);

  return {
    productCount: products.count ?? 0,
    orderCount: orders.count ?? 0,
    subscriberCount: subscribers.count ?? 0,
    revenue,
    recentOrders: orders.data ?? [],
  };
}

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-[var(--color-background-warning)] text-[var(--color-text-warning)]",
  paid: "bg-[var(--color-background-info)]    text-[var(--color-text-info)]",
  processing:
    "bg-[var(--color-background-info)]    text-[var(--color-text-info)]",
  shipped:
    "bg-[var(--color-background-success)]  text-[var(--color-text-success)]",
  delivered:
    "bg-[var(--color-background-success)]  text-[var(--color-text-success)]",
  cancelled:
    "bg-[var(--color-background-danger)]   text-[var(--color-text-danger)]",
  refunded:
    "bg-[var(--color-background-danger)]   text-[var(--color-text-danger)]",
};

export default async function AdminDashboard() {
  const { productCount, orderCount, subscriberCount, revenue, recentOrders } =
    await getStats();

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--fg)]">Overview</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Welcome back — here's what's happening with Velve.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Total revenue",
            value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          },
          { label: "Total orders", value: orderCount.toString() },
          { label: "Live products", value: productCount.toString() },
          { label: "Subscribers", value: subscriberCount.toString() },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
          >
            <p className="text-[11px] tracking-[0.08em] uppercase text-[var(--muted)] mb-2">
              {label}
            </p>
            <p className="font-serif text-2xl text-[var(--fg)]">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-medium text-[var(--fg)]">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[11px] tracking-wide uppercase text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-[var(--muted)] p-5">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Order", "Customer", "Total", "Status", "Date", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] tracking-[0.1em] uppercase text-[var(--muted)] px-5 py-3 font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-[12px] text-[var(--fg)]">
                    {order.order_number ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)] text-[12px] max-w-[140px] truncate">
                    {order.email}
                  </td>
                  <td className="px-5 py-3 text-[var(--fg)] text-[12px]">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${STATUS_STYLES[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--muted)] text-[12px]">
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders?id=${order.id}`}
                      className="text-[11px] text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
                    >
                      View →
                    </Link>
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
