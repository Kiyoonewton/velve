import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductActions from "@/components/admin/ProductActions";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, stock, is_published, is_featured, images, category_id",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--fg)]">Products</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {products?.length ?? 0} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="
            flex items-center gap-2 px-4 py-2.5
            text-[12px] tracking-[0.08em] uppercase font-medium
            bg-[var(--fg)] text-[var(--bg)]
            hover:opacity-85 transition-opacity
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add product
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
        {!products?.length ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-[var(--fg)] mb-2">
              No products yet
            </p>
            <p className="text-sm text-[var(--muted)] mb-6">
              Add your first product to get started.
            </p>
            <Link
              href="/admin/products/new"
              className="text-[11px] uppercase tracking-wider text-[var(--gold)] border-b border-[var(--gold)] pb-0.5"
            >
              Add product →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Product", "Price", "Stock", "Status", ""].map((h) => (
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
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[var(--bg)] transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 bg-[var(--border)] rounded shrink-0 overflow-hidden">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[var(--fg)] leading-tight">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-[var(--muted)]">
                          {p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--fg)] text-[13px]">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[13px] font-medium ${p.stock === 0 ? "text-[var(--color-text-danger)]" : p.stock < 5 ? "text-[var(--color-text-warning)]" : "text-[var(--fg)]"}`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${p.is_published ? "bg-[var(--color-background-success)] text-[var(--color-text-success)]" : "bg-[var(--color-background-warning)] text-[var(--color-text-warning)]"}`}
                      >
                        {p.is_published ? "Live" : "Draft"}
                      </span>
                      {p.is_featured && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full font-medium bg-[var(--color-background-info)] text-[var(--color-text-info)]">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                      >
                        Edit
                      </Link>
                      <ProductActions id={p.id} />
                    </div>
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
