import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";

export const metadata = { title: "Shop" };

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    colour?: string;
    sort?: string;
    search?: string;
  }>;
}

async function getProducts(filters: Awaited<ShopPageProps["searchParams"]>) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_price, images, colours, is_featured, category_id",
    )
    .eq("is_published", true);

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (filters.colour) {
    query = query.contains("colours", [filters.colour]);
  }

  if (filters.search) {
    query = query.textSearch("fts", filters.search, { type: "websearch" });
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  const { data } = await query;
  return data ?? [];
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("name, slug")
    .order("sort_order");
  return data ?? [];
}

const COLOURS = [
  "Gold",
  "Silver",
  "Black",
  "White",
  "Multi",
  "Pink",
  "Blue",
  "Green",
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
            {filters.search ? `Search: "${filters.search}"` : "All products"}
          </p>
          <h1 className="font-serif text-4xl text-fg">
            {activeCategory?.name ?? "Shop"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-48 shrink-0">
          <ShopFilters
            categories={categories}
            colours={COLOURS}
            activeCategory={filters.category}
            activeColour={filters.colour}
            activeSort={filters.sort}
            search={filters.search}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters row */}
          <div className="lg:hidden mb-6">
            <ShopFilters
              categories={categories}
              colours={COLOURS}
              activeCategory={filters.category}
              activeColour={filters.colour}
              activeSort={filters.sort}
              search={filters.search}
              mobile
            />
          </div>
          <ProductGrid products={products} columns={3} />
        </div>
      </div>
    </div>
  );
}
