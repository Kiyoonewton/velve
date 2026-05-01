import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsletterForm from "@/components/shop/Newsletterform";
import HeroSlider from "@/components/shop/HeroSlider";

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_price, images, colours, is_featured, stock",
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);
  return data ?? [];
}

async function getNewArrivals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, compare_price, images, colours")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}

const FEATURES = [
  {
    icon: "📦",
    title: "Swift Delivery",
    body: "Enjoy fast and reliable worldwide shipping, so your perfect beaded bag arrives at your doorstep in record time.",
  },
  {
    icon: "🧵",
    title: "Handcrafted with precision",
    body: "Each bag is meticulously crafted by skilled artisans, ensuring every bead and stitch is placed perfectly for a flawless finish.",
  },
  {
    icon: "🛍️",
    title: "Seamless and secure",
    body: "Shop with confidence knowing your experience is smooth, secure and hassle-free. Enjoy safe transactions and a user-friendly interface from start to finish.",
  },
];

function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_price?: number | null;
    images?: string[] | null;
  };
}) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className="relative overflow-hidden bg-(--surface) mb-3"
        style={{ aspectRatio: "3/4" }}
      >
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-(--surface)" />
        )}
      </div>
      <p className="text-[13px] text-(--fg) leading-snug mb-1">
        {product.name}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-(--fg) font-medium">
          ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
        {product.compare_price && product.compare_price > product.price && (
          <span className="text-[12px] text-(--muted) line-through">
            ${product.compare_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        )}
      </div>
    </Link>
  );
}

function SpotlightCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_price?: number | null;
    images?: string[] | null;
    stock?: number | null;
  };
}) {
  const soldOut = !product.stock || product.stock <= 0;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-(--surface) rounded-sm overflow-hidden"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-(--surface)" />
        )}
        {soldOut && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <span className="bg-(--fg) text-(--bg) text-[11px] tracking-[0.08em] uppercase px-3 py-1.5 rounded-full font-medium whitespace-nowrap">
              Sold out
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-3">
        <p
          className="font-script text-(--fg) leading-snug mb-1"
          style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)" }}
        >
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-script font-bold text-(--fg)"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)" }}
          >
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-[12px] text-(--muted) line-through">
              ${product.compare_price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <main className="overflow-x-hidden bg-(--bg)">
      {/* ─── Hero ─── */}
      <HeroSlider />

      {/* ─── In the Spotlight ─── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="mb-8">
            <h2
              className="font-script text-(--fg)"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              In the Spotlight
            </h2>
            <p
              className="font-script text-(--muted) mt-1"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.3rem)" }}
            >
              Top picks of the season
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <SpotlightCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── New Arrivals ─── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t border-(--border)">
          <div className="flex items-end justify-between mb-8">
            <h2
              className="font-serif text-(--fg)"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              New Arrivals
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/shop"
              className="px-8 py-3 text-[12px] tracking-[0.12em] uppercase font-medium border border-(--fg) text-(--fg) hover:bg-(--fg) hover:text-(--bg) transition-colors duration-200"
            >
              Shop all
            </Link>
          </div>
        </section>
      )}

      {/* ─── Feature strips ─── */}
      <section className="border-t border-(--border) py-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-12">
          {FEATURES.map(({ icon, title, body }) => (
            <div key={title} className="text-center">
              <p className="text-3xl mb-4">{icon}</p>
              <h3
                className="font-serif text-(--fg) mb-3"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
              >
                {title}
              </h3>
              <p className="text-[13px] text-(--muted) leading-[1.8]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="border-t border-(--border) py-14 px-5 sm:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h2
            className="font-serif text-(--fg) mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            Subscribe to our emails
          </h2>
          <p className="text-[13px] text-(--muted) mb-8">
            New drops, exclusive offers, and behind-the-scenes craft stories.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
