import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ProductGallery from "@/components/shop/ProductGallery";
import AddToCartForm from "@/components/shop/Addtocartform";
import ProductGrid from "@/components/shop/ProductGrid";

interface PDPProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

async function getRelated(categoryId: string, excludeId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_price, images, colours, is_featured",
    )
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .neq("id", excludeId)
    .limit(4);
  return data ?? [];
}

export async function generateMetadata({
  params,
}: PDPProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.meta_title ?? product.name,
    description: product.meta_desc ?? product.description,
    openGraph: { images: product.images?.[0] ? [product.images[0]] : [] },
  };
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = product.category_id
    ? await getRelated(product.category_id, product.id)
    : [];

  const isOnSale =
    product.compare_price && product.compare_price > product.price;
  const discount = isOnSale
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100,
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] text-muted mb-8 tracking-wide">
        <a href="/shop" className="hover:text-fg transition-colors">
          Shop
        </a>
        {product.categories && (
          <>
            <span>/</span>
            <a
              href={`/shop?category=${product.categories.slug}`}
              className="hover:text-fg transition-colors"
            >
              {product.categories.name}
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-fg">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Gallery */}
        <ProductGallery images={product.images ?? []} name={product.name} />

        {/* Info + form */}
        <div className="lg:py-4">
          {product.categories && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
              {product.categories.name}
            </p>
          )}

          <h1 className="font-serif text-4xl text-fg leading-tight mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-2xl text-fg">
              ${Number(product.price).toFixed(2)}
            </span>
            {isOnSale && (
              <>
                <span className="text-[15px] text-muted line-through">
                  ${Number(product.compare_price).toFixed(2)}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 bg-fg text-bg">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-muted leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Add to cart form — client component */}
          <AddToCartForm
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] ?? "",
              colours: product.colours ?? [],
              sizes: product.sizes ?? [],
              stock: product.stock,
            }}
          />

          {/* Meta details */}
          <div className="mt-8 pt-8 border-t border-border space-y-3">
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-[12px] text-amber-600">
                Only {product.stock} left in stock
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-[12px] text-red-500">
                Out of stock
              </p>
            )}
            <div className="flex flex-col gap-2 text-[12px] text-muted">
              <span>Free shipping on orders over $150</span>
              <span>Handcrafted to order — allow 3–5 business days</span>
              <span>WhatsApp us for custom colour requests</span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/2348000000000?text=Hi! I'm interested in: ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-5 inline-flex items-center gap-2
              text-[11px] tracking-[0.08em] uppercase
              text-muted hover:text-fg
              border-b border-border hover:border-fg
              pb-0.5 transition-colors duration-200
            "
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Ask about custom orders
          </a>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <div className="border-t border-border pt-16 mb-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
              You may also like
            </p>
            <h2 className="font-serif text-2xl text-fg">
              Related pieces
            </h2>
          </div>
          <ProductGrid products={related} columns={4} />
        </div>
      )}
    </div>
  );
}
