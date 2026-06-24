export const dynamic = "force-dynamic";

import pool from "@/lib/db";
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
  let query = `SELECT id, name, slug, price::float, compare_price::float, images, colours, is_featured, category_id, production_date FROM products WHERE is_published = true`;
  const params: any[] = [];

  if (filters.category) {
    params.push(filters.category);
    const { rows: cats } = await pool.query(`SELECT id FROM categories WHERE slug = $1`, [filters.category]);
    if (cats[0]) {
      params.push(cats[0].id);
      query += ` AND category_id = $${params.length}`;
      params.pop();
      params.pop();
      params.push(cats[0].id);
      query = query.replace(`AND category_id = $${params.length}`, `AND category_id = $${params.length}`);
    }
  }

  if (filters.colour) {
    params.push(filters.colour);
    query += ` AND $${params.length} = ANY(colours)`;
  }

  if (filters.search) {
    params.push(filters.search);
    query += ` AND fts @@ websearch_to_tsquery('english', $${params.length})`;
  }

  switch (filters.sort) {
    case "price-asc":  query += ` ORDER BY price ASC`; break;
    case "price-desc": query += ` ORDER BY price DESC`; break;
    case "newest":     query += ` ORDER BY created_at DESC`; break;
    default:           query += ` ORDER BY is_featured DESC, created_at DESC`;
  }

  const { rows } = await pool.query(query, params);
  return rows;
}

async function getCategories() {
  const { rows } = await pool.query(`SELECT name, slug FROM categories ORDER BY sort_order`);
  return rows;
}

const COLOURS = ["Gold", "Silver", "Black", "White", "Multi", "Pink", "Blue", "Green"];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = await searchParams;
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);
  const activeCategory = categories.find((c: any) => c.slug === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
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
        <div className="flex-1 min-w-0">
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
