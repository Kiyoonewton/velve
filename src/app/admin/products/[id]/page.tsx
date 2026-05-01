import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, compare_price, stock, images, colours, tags, is_published, is_featured, weight_grams, meta_title, meta_desc",
    )
    .eq("id", id)
    .single();

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
