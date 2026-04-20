import { createClient } from "@/lib/supabase/server";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export const metadata = { title: "Orders" };

const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

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

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, email, total, status, created_at, items, shipping_name, tracking_number",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--fg)]">Orders</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {orders?.length ?? 0} total orders
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        {!orders?.length ? (
          <p className="text-sm text-[var(--muted)] p-8 text-center">
            No orders yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {[
                  "Order",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Tracking",
                  "Date",
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
              {orders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--bg)] transition-colors align-top"
                  >
                    <td className="px-5 py-4 font-mono text-[12px] text-[var(--fg)] whitespace-nowrap">
                      {order.order_number ?? order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] text-[var(--fg)]">
                        {order.shipping_name ?? "—"}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] truncate max-w-[160px]">
                        {order.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[var(--muted)]">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-medium text-[var(--fg)] whitespace-nowrap">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusUpdater
                        orderId={order.id}
                        currentStatus={order.status}
                        statuses={ORDER_STATUSES}
                        statusStyles={STATUS_STYLES}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusUpdater
                        orderId={order.id}
                        currentStatus={order.status}
                        trackingNumber={order.tracking_number ?? ""}
                        isTrackingField
                        statuses={ORDER_STATUSES}
                        statusStyles={STATUS_STYLES}
                      />
                    </td>
                    <td className="px-5 py-4 text-[12px] text-[var(--muted)] whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
