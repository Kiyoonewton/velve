import { notFound } from "next/navigation";
import pool from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id, name, slug, description, price, compare_price, stock, images, colours, tags, is_published, is_featured, weight_grams, meta_title, meta_desc, production_date FROM products WHERE id = $1`,
    [id],
  );
  const product = rows[0];

  if (!product) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--fg)]">Edit product</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
